// Writes a prerendered HTML file for every page in every language (/, /landscaping,
// /hi/, /hi/landscaping, /pa/, /pa/landscaping), the sitemap and the 404 page.
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { dirname } from "node:path"
import { pathToFileURL } from "node:url"

const { renderPage, routes, pathFor, LANGS, sitemap } = await import(pathToFileURL("dist-ssr/entry-server.js").href)

// Preload each language's main fonts so text appears in its final font straight away, instead
// of swapping in later and reflowing the page.
const assets = readdirSync("dist/assets")
const fontsFor = {
  en: /^(lora|raleway)-latin-wght-normal-.*\.woff2$/,
  hi: /^(noto-serif-devanagari-devanagari|raleway-latin)-wght-normal-.*\.woff2$/,
  pa: /^(noto-serif-gurmukhi-gurmukhi|raleway-latin)-wght-normal-.*\.woff2$/,
}
const base = readFileSync("dist/index.html", "utf8")
const withPreloads = (lang) => {
  const links = assets.filter((f) => fontsFor[lang].test(f)).map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  return base.replace("</head>", `  ${links.join("\n    ")}\n  </head>`)
}
const template = withPreloads("en")

for (const lang of LANGS.map((l) => l.id)) {
  for (const route of routes) {
    const path = pathFor(route, lang)
    // Home pages are folders (/, /hi/, /pa/); /landscaping pages are .html files, which Netlify
    // serves at the extensionless URL without a redirect, matching the canonical URLs.
    const file = path.endsWith("/") ? `dist${path}index.html` : `dist${path}.html`
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, await renderPage(withPreloads(lang), path))
    console.log("prerendered", path)
  }
}

// Unknown URLs get the app shell, kept out of search results.
writeFileSync(
  "dist/404.html",
  template
    .replace(/<!--head-->[\s\S]*<!--\/head-->/, "<title>Page not found — Canadian Grass Farm</title>")
    .replace('<meta name="robots" content="index, follow, max-image-preview:large" />', '<meta name="robots" content="noindex" />'),
)

writeFileSync("dist/sitemap.xml", sitemap(new Date().toISOString().slice(0, 10)))
rmSync("dist-ssr", { recursive: true, force: true })
