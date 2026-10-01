# Puse

A submission for the [YouCam API Skin AI & eCommerce VTO Hackathon](https://devpost.com/submit-to/31400-youcam-api-skin-ai-ecommerce-vto-hackathon). This is a standalone project, independent of any other repository in this workspace, with its own license (MIT, see `LICENSE`).

Upload a selfie and get a real YouCam Skin AI analysis, matched to skincare products that address your actual top concerns. Upload a full-body photo and try on apparel with YouCam's Clothes Virtual Try-On before you buy. Add matches and try-on looks to one bag, demo-checkout, and use the floating **shop agent** to chain Skin AI scores to SKUs. Results save to session or your account (`/history`). Both hackathon tracks in one Puse-designed shop flow.

## Stack

Next.js 16 (App Router) + TypeScript + Tailwind. Next.js Route Handlers are the backend — they hold the YouCam API key server-side (it never reaches the browser) and are the only thing that talks to Perfect Corp's API. Persistence is SQLite via Prisma 7 (driver-adapter based — `@prisma/adapter-better-sqlite3`, no bundled Rust query engine), good for local dev and for judges running this from the repo. See "Deploying with a hosted database" below for swapping to Postgres.

## Data model

- `Product` — the catalog (8 skincare, 4 apparel), seeded from `prisma/seed.ts`.
- `SkinAnalysisResult` — one row per completed skin-analysis task, keyed by an anonymous session cookie.
- `TryOnResult` — one row per completed try-on render, linked to the `Product` tried on.

Session identity is a random `httpOnly` cookie (`src/lib/session.ts`) set the first time a task completes — no login. `/history` reads both tables for the current session's cookie.

## YouCam APIs used

- **AI Skin Analysis** (`/s2s/v2.0/task/skin-analysis`) — `src/lib/youcam/client.ts`
- **AI Clothes Virtual Try-On v4** (`/s2s/v2.0/task/cloth-v4`) — `src/lib/youcam/client.ts`
- **Clothes Templates** (`/s2s/v2.0/task/template/cloth`) — used to source real garment thumbnail photos for the apparel catalog. Try-on itself uses Clothes VTO v4 with `ref_file_url` (template ids are listing-only and are not sent to cloth-v4).
- **File API** (`/s2s/v2.0/file`) — used by both, for uploading the user's photo

All three are task-based: create a task, poll it, get a result URL. `src/lib/use-polled-task.ts` is the client-side polling hook shared by both flows. The poll route handlers (`src/app/api/skin-analysis/[taskId]`, `src/app/api/try-on/[taskId]`) persist the result to the database the moment YouCam reports `task_status: "success"`.

## Setup

1. Get a YouCam API key: sign up at https://yce.perfectcorp.com/ai-api, then redeem your hackathon code (1,000 free API units) under Account → Redeem Code.
2. Copy `.env.example` to `.env.local` and paste the key into `YOUCAM_API_KEY`. `DATABASE_URL` is already set to a local SQLite file and needs no changes for local dev.
3. Install, generate the Prisma client, create + seed the database, and run:

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open http://localhost:3000. (`npm install` also runs `prisma generate` automatically via its `postinstall` script — you shouldn't need to run that by hand, but `npx prisma generate` is safe to re-run if `src/generated/prisma` ever goes missing.)

## Deploying with a hosted database

SQLite is a local file — fine for `npm run dev` and for a judge cloning the repo, but it won't survive a typical serverless deploy (e.g. Vercel) with multiple instances. To deploy:

1. Provision a Postgres database (Neon, Supabase, or Vercel Postgres all work).
2. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"` under `datasource db`.
3. Swap the adapter in `src/lib/db.ts` (and `prisma/seed.ts`) from `@prisma/adapter-better-sqlite3` to `@prisma/adapter-pg` (`npm install @prisma/adapter-pg`), and construct it with your Postgres connection string.
4. Set `DATABASE_URL` to the hosted connection string in your deployment platform's environment variables, then run `npm run db:push && npm run db:seed` once against it (or `prisma migrate deploy` if you set up migrations).

## Before recording the demo / submitting

- Apparel catalog photos are real YouCam Clothes VTO template thumbnails. Skincare catalog photos live under `public/images/skincare/` and are seeded into each product's `image` field.
- Full-body photo requirements for the Clothes VTO API (single person, forward-facing, shoulders to feet visible, no obstructions) are in the "File Specs & Errors" section of the [AI Clothes API reference](https://docs.perfectcorp.com/reference/ai_clothes).

## Project structure

```
src/app/                          landing, /analyze, /catalog, /history, /try-on/[productId]
src/app/api/upload                proxies an uploaded image to the YouCam File API
src/app/api/skin-analysis         create + poll a skin-analysis task, persists on success
src/app/api/try-on                create + poll a cloth-v4 (VTO) task, persists on success
src/lib/youcam/client.ts          YouCam API client (auth, upload, task create/poll)
src/lib/products.ts               DB-backed product catalog access (Prisma queries)
src/lib/db.ts                     Prisma client singleton (SQLite driver adapter)
src/lib/session.ts                anonymous session cookie read/create
prisma/schema.prisma              Product, SkinAnalysisResult, TryOnResult models
prisma/seed.ts                    seeds the product catalog
prisma.config.ts                  Prisma 7 config (datasource URL, migrations, seed command)
```

## Hackathon submission checklist

From the official rules:

- [ ] Public (or shared with `contact_event@PerfectCorp.com`) repo with everything needed to run it
- [ ] Text description of features, functionality, and consumer/retail value
- [ ] Screenshots
- [ ] 1–3 minute demo video, uploaded to YouTube/Vimeo, explaining which YouCam API(s) are used and showing the project running end-to-end
