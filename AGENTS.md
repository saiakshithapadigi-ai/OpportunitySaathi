# AGENTS.md

## Project overview

OpportunitySaathi is a student opportunity directory. It is built with TanStack Start and deployed on Netlify. Public visitors see a marketing landing page. Signed-in students get the full board, direct apply links and a tracker tied to their account.

## Architecture

| Concern | Implementation |
|---|---|
| Framework | TanStack Start (React 19, file-based TanStack Router), Vite 7 |
| Styling | Tailwind CSS 4. Brand tokens are in `src/styles.css` (`@theme`: night, ink, cream, saffron, coral, mint; `.bg-brand` gradient; `.text-gradient`) |
| Auth | Netlify Identity via `@netlify/identity`. Client mutations (`login`, `signup`) are followed by a full `window.location.href` navigation so the `nf_jwt` cookie reaches SSR |
| Data | Opportunity content is static in `src/data/opportunities.ts`. Per-user tracker rows are stored in Netlify Database (`db/schema.ts`, table `tracked_opportunities`, unique on user + opportunity) |
| Images | Hero art in `public/img/hero.png`, served through `/.netlify/images`. Org logos come from Google's favicon service via `logoUrl()`, with a monogram fallback in `OrgLogo` |

## Key files

- `src/routes/index.tsx`: public landing page
- `src/routes/login.tsx`: sign in, create account and forgot-password page (search params `mode`, `redirect`)
- `src/routes/_authed.tsx`: pathless guard; `beforeLoad` calls `getServerUser` and redirects to `/login` when signed out
- `src/routes/_authed/opportunities.index.tsx`: board with filters held in URL search params
- `src/routes/_authed/opportunities.$id.tsx`: detail page
- `src/routes/_authed/tracker.tsx`: tracker
- `src/lib/tracker.ts`: server functions (`listTracked`, `setTracked`, `removeTracked`), protected by `requireAuthMiddleware`
- `src/lib/use-tracker.ts`: client hook with optimistic updates
- `src/components/ApplyDialog.tsx`: direct-apply flow; opening the official link marks the listing as `applied`
- `src/components/CallbackHandler.tsx`: handles Identity email-confirmation, OAuth and recovery hashes

## Conventions

- Server functions use `.inputValidator(zodSchema)` and never `.validator`.
- Schema changes: edit `db/schema.ts`, then run `npx drizzle-kit generate --name <change>`. Migrations go to `netlify/database/migrations/` and are applied by Netlify on deploy. Never run migrate or push.
- Import the DB through `db/index.ts` with `.js` extensions.
- Every opportunity must link to an official organisation page. Use "cycle" wording such as "usually opens Aug – Nov" rather than hard deadlines, because the official site is the source of truth.
- The `@/` alias maps to `src/`.

## Possible next steps

- An admin screen for adding and editing listings, which would move opportunities into the database
- Email reminders before typical application windows open
- Notes per tracked item (the `notes` column already exists)
