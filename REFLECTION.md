# Reflection

## Trade-offs

The biggest architectural decision was choosing Supabase as the backend. Rather than building a custom authentication system with password hashing, session management, email delivery, and a standalone database, Supabase gave us auth, a Postgres database, and row-level security out of the box. This let us focus almost entirely on the user-facing experience — the guided check-in flow — instead of plumbing. The trade-off is coupling: we're tied to Supabase's auth conventions, its client library, and its hosting model. Migrating away would mean reimplementing auth and rewriting every database call. With more time, I'd abstract the Supabase client behind a thin service layer so the rest of the app doesn't import it directly.

On the frontend, React Router handles navigation between the check-in steps and the login/signup pages. The step-by-step flow (breathe, reflect, gratitude, intention) is simple enough that a state machine or more formal wizard abstraction wasn't necessary, but if the flow grew more complex — branching paths, conditional steps — that would be worth revisiting.

I also chose Biome over ESLint/Prettier for linting and formatting. It's faster and simpler to configure, but the ecosystem of plugins is smaller. For a project this size that trade-off is clearly worth it.

## Limitations

The most obvious gap is that **completed check-ins aren't visible anywhere** after submission. Users go through the flow, their data is saved, but there's no history view, no streaks, no way to look back at what they wrote. This is the first thing I'd build next — it's essential for the habit-forming loop the app is trying to create.

There's also **no verification email on signup** yet. Users can register with any email address and immediately access the app. In production this would need to be addressed both for security (preventing fake accounts) and for any future features that rely on email delivery, like reminders or password resets.

## AI Usage

I used **Claude Code** (Anthropic's CLI agent) as my only AI tool throughout the project. It was involved in essentially every stage: scaffolding the initial project structure, writing tests and production code following TDD, building out the check-in flow components, integrating Supabase auth, and iterating on the UI to match the Action for Happiness design language.

The workflow was conversational — I'd describe what I wanted, review the code Claude produced, and course-correct when needed. Most of the time the output was usable directly or with minor adjustments. Where I intervened most was around design decisions and product direction: Claude is good at writing code to a spec, but the spec itself — what the check-in steps should feel like, how the flow should be paced — required human judgement.
