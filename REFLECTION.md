# Reflection

## Trade-offs

The biggest architectural decision was choosing Supabase as the backend. Rather than building a custom authentication system with password hashing, session management, email delivery, and a standalone database, Supabase gave us auth, a Postgres database, and row-level security out of the box. This let us focus almost entirely on the user-facing experience — the guided check-in flow — instead of plumbing. The trade-off is coupling: we're tied to Supabase's auth conventions, its client library, and its hosting model. Migrating away would mean reimplementing auth and rewriting every database call. With more time, I'd abstract the Supabase client behind a thin service layer so the rest of the app doesn't import it directly.

On the frontend, React Router handles navigation between the check-in steps and the login/signup pages. The step-by-step flow (breathe, reflect, gratitude, intention) is simple enough that a state machine or more formal wizard abstraction wasn't necessary, but if the flow grew more complex — branching paths, conditional steps — that would be worth revisiting.

I also chose Biome over ESLint/Prettier for linting and formatting. It's faster and simpler to configure, but the ecosystem of plugins is smaller. For a project this size that trade-off is clearly worth it.

## Limitations

The most obvious gap is that **completed check-ins aren't visible anywhere** after submission. Users go through the flow, their data is saved, but there's no history view, no streaks, no way to look back at what they wrote. This is the first thing I'd build next — it's essential for the habit-forming loop the app is trying to create.

There's also **no verification email on signup** yet. Users can register with any email address and immediately access the app. In production this would need to be addressed both for security (preventing fake accounts) and for any future features that rely on email delivery, like reminders or password resets.

## Daily Reminder Emails

The app sends a daily reminder email to all registered users, nudging them to complete their check-in. This is driven entirely from the database layer using PostgreSQL extensions, with no external scheduler or separate worker process.

**pg_cron** triggers a PL/pgSQL function every day at 09:00 UTC. That function reads secrets (the internal API URL and a service-role JWT) from **Supabase Vault**, then fires an HTTP POST via **pg_net** to a Supabase Edge Function. The edge function paginates through all users with the admin API and sends each one a branded HTML email.

For email delivery the function supports two providers, selected by environment variables: a raw **SMTP** connection (implemented with Deno's TCP API — no third-party library) or the **Resend** HTTP API as a cloud fallback. In local development, Supabase's built-in **Inbucket** server captures all outbound mail so emails can be inspected in a web UI on port 54325 without touching a real inbox.

Keeping the scheduler inside the database (pg_cron → pg_net → Edge Function) means there is no separate cron host to maintain and the secrets never leave Supabase's Vault. The trade-off is debuggability: if the HTTP call fails silently, there is no built-in retry or dead-letter queue — you'd need to check the `net._http_response` table manually. Adding observability (logging, retry logic, or a webhook on failure) would be a sensible next step for production use.

**Important caveat:** the local email flow (pg_cron → Edge Function → Inbucket) was not end-to-end tested during development due to time constraints. The individual pieces — the Edge Function code, the email template, the migration SQL — were written and reviewed, but the full chain was never triggered locally to confirm that emails actually arrive in Inbucket. There may be issues with networking between containers, Vault secret resolution at runtime, or SMTP handshake details that only surface when the whole pipeline runs together. This should be validated before relying on it.

## Next Steps

- **User-configurable email schedule.** The daily reminder is currently hard-coded to 09:00 UTC for everyone. Users should be able to choose when they receive their reminder — both the time of day and their timezone. This would likely involve storing a preferred schedule per user and either creating per-user pg_cron entries or batching sends by timezone offset.
- **Check-in history view.** Completed check-ins are saved to the database but there's no way to review them. A history page showing past entries — with the ability to look back at feelings, gratitude notes, and intentions over time — is essential for the habit-forming loop the app is trying to create. Streaks and simple trends would add further motivation.

## AI Usage

I used **Claude Code** (Anthropic's CLI agent) as my only AI tool throughout the project. It was involved in essentially every stage: scaffolding the initial project structure, writing tests and production code following TDD, building out the check-in flow components, integrating Supabase auth, and iterating on the UI to match the Action for Happiness design language.

The workflow was conversational — I'd describe what I wanted, review the code Claude produced, and course-correct when needed. Most of the time the output was usable directly or with minor adjustments. Where I intervened most was around design decisions and product direction: Claude is good at writing code to a spec, but the spec itself — what the check-in steps should feel like, how the flow should be paced — required human judgement.
