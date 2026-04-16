# Daily Check-In

A guided daily check-in webapp inspired by [Action for Happiness](https://actionforhappiness.org/) that helps you start your day with intention. The app walks you through a short sequence of mindfulness steps:

1. **Breathe** — A guided breathing exercise to calm and centre yourself.
2. **Feel** — Reflect on how you're feeling right now, without judgement.
3. **Gratitude** — Name something you're grateful for today.
4. **Intention** — Set a positive intention to carry into the day.

Registered users receive a daily reminder email at 09:00 UTC prompting them to complete their check-in.

## Tech Stack

- **Frontend:** React 19, React Router, Vite, TypeScript
- **Backend:** Supabase (Postgres, Auth with row-level security, Edge Functions, Vault)
- **Email:** Supabase Edge Function with SMTP or Resend API; Inbucket for local dev
- **Scheduling:** pg_cron + pg_net (database-level cron, no external scheduler)
- **Linting/Formatting:** Biome
- **Testing:** Vitest, Testing Library
- **Package Manager:** pnpm

## Getting Started

### Prerequisites

- Node.js
- pnpm
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- Docker (required by `supabase start`)

### Running Locally

```bash
pnpm install
pnpm start
```

`pnpm start` runs `supabase start` (Postgres, Auth, Edge Functions, Inbucket) and then starts the Vite dev server.

### Useful Commands

| Command | Description |
|---------|-------------|
| `pnpm start` | Start Supabase + Vite dev server |
| `pnpm dev` | Start only the Vite dev server |
| `pnpm build` | Compile TypeScript / build for production |
| `pnpm typecheck` | Type-check without emitting (`tsc --noEmit`) |
| `pnpm test` | Run tests (Vitest) |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm lint` | Run Biome linter |
| `pnpm lint:fix` | Run Biome linter with auto-fix |

### Local Email Testing

Supabase's local stack includes **Inbucket**, a test mail server. All emails sent during development are captured there — no real emails are delivered. Open [http://localhost:54325](http://localhost:54325) to inspect them.

## Architecture

### Authentication

Supabase Auth handles signup, login, and session management. Row-level security policies on the Postgres tables ensure users can only access their own data.

### Daily Reminder Emails

A **pg_cron** job runs daily at 09:00 UTC, calling a PL/pgSQL function that reads secrets from **Supabase Vault** and invokes a **Supabase Edge Function** via **pg_net**. The edge function iterates over all users and sends a branded HTML email through either a raw SMTP connection or the Resend API, depending on which environment variables are configured.

### Design

The UI follows the visual identity of Action for Happiness — warm colours (crimson, orange, green), Campton typography, rounded corners, and a friendly, encouraging tone.
