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

## One-time setup

1. **Create a Supabase project** at supabase.com (free tier is fine).
2. **Storage**: create a private bucket named `ebooks`. Upload each book's
   files as `<slug>.epub` and `<slug>.pdf` (slug matches the `slug` field in
   `functions/_shared/ebookCatalog.json`).
3. **Database**: run the migration in `migrations/0001_ebooks.sql` (via the
   Supabase SQL editor, or `supabase db push` with the CLI).
4. **Edge functions**: deploy everything in `functions/` (via
   `supabase functions deploy` with the CLI, once linked to the project).
5. **Secrets** (Project Settings → Edge Functions → Secrets):
   - `STRIPE_SECRET_KEY` — from your Stripe dashboard
   - `STRIPE_WEBHOOK_SECRET` — created in the next step
   - `RESEND_API_KEY` — from resend.com
   - `EMAIL_FROM` — e.g. `orders@moazkhanbooks.com` (must be a verified
     sending domain in Resend)
   - `SITE_URL` — `https://moazkhanbooks.com`
   - `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — Supabase sets these
     automatically for edge functions, no action needed.
6. **Stripe webhook**: in the Stripe dashboard, add an endpoint pointing to
   `<your-functions-url>/stripe-webhook`, subscribed to
   `checkout.session.completed`. Copy the signing secret into
   `STRIPE_WEBHOOK_SECRET` above.
7. **Frontend**: set these as GitHub Actions repo secrets (Settings →
   Secrets and variables → Actions) so the build picks them up:
   - `VITE_SUPABASE_FUNCTIONS_URL` = `https://<project-ref>.supabase.co/functions/v1`
   - `VITE_SUPABASE_FUNCTIONS_ORIGIN` = `https://<project-ref>.supabase.co`
8. **Catalog**: add real entries to `functions/_shared/ebookCatalog.json`
   (backend pricing authority) and the matching entries in
   `moazkhanbooks/src/data/ebooks.ts` (frontend display) — same slug/title/
   price/formats in both.
