# OpportunitySaathi

Your student opportunity companion. OpportunitySaathi brings together real internships, scholarships, hackathons, free courses, fellowships and student programmes from organisations like Google, Microsoft, ISRO, NITI Aayog, Reliance Foundation, Chevening and NPTEL. Each listing has a **direct apply** button that goes to the official application page.

Visitors see the landing page and a teaser. After signing in or creating a free account, students can see the full opportunity board, filter it, save listings, apply directly and track their applications in a tracker tied to their account.

## Features

- Branded landing page with an illustrated hero, organisation logos, category tiles and a locked preview
- Sign in, create account and password reset (Netlify Identity)
- Protected opportunities board with search, category chips, location, cost and sort filters
- Opportunity detail pages with eligibility, perks, application cycle and related listings
- Direct-apply dialog with a document checklist that opens the official site and marks the listing as *Applied*
- Personal tracker (Saved → Applied → Interview → Offer / Rejected), stored in Netlify Database

## Tech stack

- TanStack Start (React 19, TanStack Router) with Vite
- Tailwind CSS 4
- Netlify Identity via `@netlify/identity`
- Netlify Database (Postgres) with Drizzle ORM
- Netlify Image CDN for the hero artwork

## Running locally

```bash
pnpm install
netlify dev
```

Authentication only works on a deployed Netlify site (a deploy preview or production), because Identity sessions are issued by Netlify.

## Updating opportunities

All listings live in `src/data/opportunities.ts`. Add an entry with an official `applyUrl` and the organisation `domain` (used to fetch its logo).
