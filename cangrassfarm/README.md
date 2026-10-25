# cangrassfarm.com

Website for **Canadian Grass Farm & Flower Nursery**, Malerkotla, Punjab.
React + Vite + Tailwind CSS v4 + Motion (Framer Motion), "liquid gel grass" theme.

## Pages

- `/`: flower catalogue. All 31 flowers we grow, with benefits, tea/medicine/kitchen uses, care tips, safety notes, search and filters, plus an order list that is sent to Moaviz on WhatsApp.
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
- Images: `public/img/flowers/<slug>.webp` (square photos, up to 480×480); project photos in `public/img/projects/`; concept photos in `public/img/concepts/`.

## Deploy

Hosted on Netlify. `netlify.toml` at the repo root holds the settings (base `cangrassfarm`, build `npm run build`, publish `dist`, Node 22), so importing the repo in Netlify needs no manual build settings. Pushes to `main` that don't touch `cangrassfarm/` are skipped.

`public/CNAME` is left for GitHub Pages compatibility and is ignored by Netlify. This repo's GitHub Pages slot serves moazkhanbooks.com.
