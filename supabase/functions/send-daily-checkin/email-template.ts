export function buildCheckinEmailSubject(): string {
  return "Your Daily Check-In Reminder";
}

export function buildCheckinEmailHtml(appUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f1f1f1; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f1f1; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 5px; box-shadow: 0 15px 20px -10px rgba(0,0,0,0.2); padding: 40px;">
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <h1 style="color: #392e44; font-size: 28px; margin: 0;">Daily Check-In</h1>
            </td>
          </tr>
          <tr>
            <td style="color: #392e44; font-size: 16px; line-height: 1.6; padding-bottom: 30px;">
              <p style="margin: 0 0 12px;">Take a moment to pause, breathe, and reflect on how you're feeling today.</p>
              <p style="margin: 0;">Your daily check-in is a simple practice to help you start your day with intention, gratitude, and awareness.</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <a href="${appUrl}" style="display: inline-block; background-color: #db2350; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 5px; font-size: 16px; font-weight: bold;">Start your check-in</a>
            </td>
          </tr>
          <tr>
            <td align="center" style="color: #999; font-size: 12px;">
              <p style="margin: 0;">Action for Happiness &mdash; Daily Check-In</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
