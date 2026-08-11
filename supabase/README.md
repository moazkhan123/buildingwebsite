# Ebook sales backend

This directory holds the Supabase project (database + edge functions) that
powers direct ebook sales on moazkhanbooks.com. The main site stays a static
GitHub Pages deploy; this is a separate small backend it talks to.

## How it works

1. Buyer clicks "Buy Ebook" → `create-checkout` creates a Stripe Checkout
   Session and a `pending` order row, redirects to Stripe's hosted payment
   page.
2. Stripe redirects back to `moazkhanbooks.com/?download=<token>` regardless
   of outcome; meanwhile Stripe calls `stripe-webhook` server-to-server on
   successful payment, which marks the order `paid` and emails the download
   link via Resend.
3. The download page polls `get-order` until the order shows `paid` (usually
   near-instant), then shows format buttons.
4. Clicking a format calls `download`, which checks the order is paid, logs
   a download event, and returns a short-lived signed URL to the actual file
   in private Supabase Storage. The `?download=` link itself never expires,
   so buyers can always come back and re-download.

## Deployment

Deploys automatically via `.github/workflows/deploy-supabase.yml` whenever
anything in `supabase/` changes on `main` — no local CLI needed. That
workflow links the project, pushes database migrations, deploys all edge
functions, and syncs edge function secrets from GitHub Actions secrets.

## One-time setup

1. **Create a Supabase project** at supabase.com (free tier is fine).
2. **Storage**: create a private bucket named `ebooks`. Upload each book's
   files as `<slug>.epub` and `<slug>.pdf` (slug matches the `slug` field in
   `functions/_shared/ebookCatalog.json`).
3. **GitHub Actions secrets** (Settings → Secrets and variables → Actions
   on the repo) — the deploy workflow reads all of these:
   - `SUPABASE_ACCESS_TOKEN` — Supabase account → Access Tokens
   - `SUPABASE_DB_PASSWORD` — the database password set when the project
     was created (Project Settings → Database if you need to reset it)
   - `STRIPE_SECRET_KEY` — Stripe dashboard → Developers → API keys
   - `STRIPE_WEBHOOK_SECRET` — created in the next step
   - `RESEND_API_KEY` — from resend.com
   - `EMAIL_FROM` — e.g. `orders@moazkhanbooks.com` (must be a verified
     sending domain in Resend)
   - `VITE_SUPABASE_FUNCTIONS_URL` = `https://sdfkcsurcgxnslhytznn.supabase.co/functions/v1`
   - `VITE_SUPABASE_FUNCTIONS_ORIGIN` = `https://sdfkcsurcgxnslhytznn.supabase.co`

   (`SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are injected automatically
   into edge functions by Supabase — nothing to set for those.)
4. **Stripe webhook**: once the functions have deployed at least once, add
   an endpoint in the Stripe dashboard pointing to
   `https://sdfkcsurcgxnslhytznn.supabase.co/functions/v1/stripe-webhook`,
   subscribed to `checkout.session.completed`. Copy the signing secret into
   the `STRIPE_WEBHOOK_SECRET` GitHub secret above (re-run the workflow, or
   push any change under `supabase/`, to sync it).
5. **Catalog**: add real entries to `functions/_shared/ebookCatalog.json`
   (backend pricing authority) and the matching entries in
   `moazkhanbooks/src/data/ebooks.ts` (frontend display) — same slug/title/
   price/formats in both.
