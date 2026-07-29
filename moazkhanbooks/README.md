# moazkhanbooks.com

Author website for Moaz Khan, deployed at [moazkhanbooks.com](https://moazkhanbooks.com) via GitHub Pages.

## Stack

- [Vite](https://vite.dev) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (CSS-first config, no `tailwind.config.js` — theme tokens live in `src/index.css`)
- [Motion](https://motion.dev) (`motion/react`) for animation
- Self-hosted variable fonts via [Fontsource](https://fontsource.org) (Playfair Display, Inter)
- [Formspree](https://formspree.io) for the review form (no backend)

## Structure

- `src/App.tsx` — page layout (header, hero, books, about, contact)
- `src/data/books.ts` — the book catalog: titles, descriptions, cover images, per-market Amazon links
- `src/components/BookCarousel.tsx` — the 3D coverflow carousel, driven by a single Motion value for position
- `src/components/BookDetailPanel.tsx`, `ReviewModal.tsx`, `MarketLinks.tsx` — book detail card, review form, per-market purchase links
- `src/lib/useBookStructuredData.ts` — generates JSON-LD `Book` structured data from the live catalog

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # typecheck + production build
npm run lint      # oxlint
npm run preview  # serve the production build locally
```

## Deployment

Pushes to `main` that touch `moazkhanbooks/**` trigger `.github/workflows/deploy-moazkhanbooks.yml`, which builds and publishes to GitHub Pages.
