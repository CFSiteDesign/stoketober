# Stoketoberfest Giveaway

Landing page for the Mad Monkey x Stoketoberfest giveaway: **win a 12-day ALL IN Indonesia trip for you + a mate** (flights not provided).
Collects name, email and phone, shows a confirmation on submit.

Styled after the printed poster (`public/poster.webp`): halftone photo backdrop, cream speech-bubble panels with a double orange stroke, lightning bolts, Montserrat Black headlines. The title lockup is cut straight from the poster (`public/stoketoberfest-title.png`).

## Stack

Vite + React + TypeScript + Tailwind (Lovable scaffold). Entries go to Supabase.

## Backend

Shared Mad Monkey giveaway Supabase project **MM-indo-giveaway** (`bunucgwewziajfbiwnhp`), table `public.stoketober_entries`. Schema in `supabase/schema.sql`.

- `anon` can INSERT only. There is no anon SELECT policy, so the publishable key in `.env` cannot read entries.
- `authenticated` can SELECT. The `/admin` page (live: `/partnership/stoketoberfest/2026/admin`) signs in as the shared giveaway admin user `admin@madmonkeyhostels.com` with a password-only login, then lists entries with search, source breakdown, CSV export and a random winner picker. The password lives only in Supabase Auth and is shared with the Siargao and Ha Giang giveaway dashboards.
- Optional `?src=qr` (or any value) on the URL is stored in the `source` column for attribution.

## Development

```sh
npm i
npm run dev
```

## Deploy

This repo syncs to Lovable. Push to `main`, then **Publish** in the Lovable editor to go live.
