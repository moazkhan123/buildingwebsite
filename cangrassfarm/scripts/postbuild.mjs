// Writes a prerendered HTML file for every page in every language (/, /landscaping,
// /hi/, /hi/landscaping, /pa/, /pa/landscaping), the sitemap and the 404 page.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname } from "node:path"
import { pathToFileURL } from "node:url"

const { renderPage, routes, pathFor, LANGS, sitemap } = await import(pathToFileURL("dist-ssr/entry-server.js").href)

const template = readFileSync("dist/index.html", "utf8")

for (const lang of LANGS.map((l) => l.id)) {
  for (const route of routes) {
    const path = pathFor(route, lang)
    // Home pages are folders (/, /hi/, /pa/); /landscaping pages are .html files, which Netlify
    // serves at the extensionless URL without a redirect, matching the canonical URLs.
    const file = path.endsWith("/") ? `dist${path}index.html` : `dist${path}.html`
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, await renderPage(template, path))
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
