import { createClient } from "jsr:@supabase/supabase-js@2";
import {
  buildCheckinEmailHtml,
  buildCheckinEmailSubject,
} from "./email-template.ts";

interface SmtpConfig {
  hostname: string;
  port: number;
  from: string;
}

async function sendSmtp(
  to: string,
  subject: string,
  html: string,
  config: SmtpConfig,
): Promise<void> {
  const conn = await Deno.connect({
    hostname: config.hostname,
    port: config.port,
  });
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  async function read(): Promise<string> {
    const buf = new Uint8Array(4096);
    const n = await conn.read(buf);
    if (n === null) throw new Error("SMTP connection closed unexpectedly");
    return decoder.decode(buf.subarray(0, n));
  }

  async function write(cmd: string): Promise<string> {
    await conn.write(encoder.encode(`${cmd}\r\n`));
    return read();
  }

  try {
    await read(); // server greeting
    await write("EHLO localhost");
    await write(`MAIL FROM:<${config.from}>`);
    await write(`RCPT TO:<${to}>`);
    await write("DATA");

    const message =
      `From: Daily Check-In <${config.from}>\r\n` +
      `To: ${to}\r\n` +
      `Subject: ${subject}\r\n` +
      `MIME-Version: 1.0\r\n` +
      `Content-Type: text/html; charset=utf-8\r\n` +
      `\r\n` +
      html +
      `\r\n.\r\n`;

    await conn.write(encoder.encode(message));
    await read(); // 250 OK
    await write("QUIT");
  } finally {
    conn.close();
  }
}

async function sendResend(
  to: string,
  subject: string,
  html: string,
  apiKey: string,
  from: string,
): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API error: ${res.status} ${body}`);
  }
}

Deno.serve(async (req) => {
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || authHeader !== `Bearer ${serviceRoleKey}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Paginate through all users
  const allUsers: { email?: string }[] = [];
  let page = 1;
  const perPage = 1000;
  while (true) {
    const {
      data: { users },
      error,
    } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    allUsers.push(...users);
    if (users.length < perPage) break;
    page++;
  }

  const appUrl = Deno.env.get("APP_URL") ?? "http://127.0.0.1:3000";
  const subject = buildCheckinEmailSubject();
  const html = buildCheckinEmailHtml(appUrl);

  const smtpHost = Deno.env.get("SMTP_HOSTNAME");
  const smtpPort = Deno.env.get("SMTP_PORT");
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const emailFrom = Deno.env.get("EMAIL_FROM") ?? "checkin@dailycheckin.local";

  const results: { email: string; status: string }[] = [];

  for (const user of allUsers) {
    if (!user.email) continue;
    try {
      if (smtpHost && smtpPort) {
        await sendSmtp(user.email, subject, html, {
          hostname: smtpHost,
          port: parseInt(smtpPort, 10),
          from: emailFrom,
        });
      } else if (resendApiKey) {
        await sendResend(user.email, subject, html, resendApiKey, emailFrom);
      } else {
        throw new Error(
          "No email provider configured. Set SMTP_HOSTNAME/SMTP_PORT or RESEND_API_KEY.",
        );
      }
      results.push({ email: user.email, status: "sent" });
    } catch (err) {
      results.push({
        email: user.email,
        status: `error: ${(err as Error).message}`,
      });
    }
  }

  return new Response(
    JSON.stringify({
      sent: results.filter((r) => r.status === "sent").length,
      results,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
});
