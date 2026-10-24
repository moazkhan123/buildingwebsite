# cangrassfarm.com

Website for **Canadian Grass Farm & Flower Nursery**, Malerkotla, Punjab.
React + Vite + Tailwind CSS v4 + Motion (Framer Motion), "liquid gel grass" theme.

## Pages

- `/`: flower catalogue. All 31 flowers from the banner, with benefits, tea/medicine/kitchen uses, care tips, safety notes, search and filters, plus an order list that is sent to Moaviz on WhatsApp.
- `/landscaping`: project gallery, sun/space concept planner, grass finder (soil, sun, use, water, season), the five grasses (Canadian, Bermuda, Golf, All Season, Winter) and hire CTA.

Orders and projects: Moaviz, +91 90413 76098.

## Develop

```bash
npm install
npm run dev
npm run build   # outputs dist/ (incl. dist/landscaping/index.html and 404.html for static hosts)
```

## Components

shadcn-style layout (`components.json`): reusable UI goes in `src/components/ui/`, imported as `@/components/ui/<name>`.

- `ui/gel.tsx`: gel buttons, segmented control, reveal animation, section headings
- `ui/jade-sky.tsx`: "Jade Sky" gradient from 21st.dev, used behind the Landscaping hero (demo in `src/demos/jade-sky-demo.tsx`)

## Content

- Flowers: `src/data/flowers.ts`
- Grasses, concepts, projects: `src/data/landscaping.ts`
- Phone number: `src/lib/contact.ts`
- Images: `public/img/flowers/<slug>.webp` (240×240) and `public/img/scenes/`. They are cropped from the banner, so replace them with real photos for sharper results (same file names).

## Deploy

`dist/` is a static site. `public/CNAME` is set to `cangrassfarm.com`.
This repo's GitHub Pages slot is already used by moazkhanbooks.com, so host this site on Netlify, Cloudflare Pages or Vercel (root `cangrassfarm`, build `npm run build`, output `dist`), or move it into its own repo for GitHub Pages.
