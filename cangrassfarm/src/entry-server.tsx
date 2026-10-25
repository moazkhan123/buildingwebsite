// Build-time prerendering: renders each page in each language to HTML so search engines
// and link previews get real content. Used by scripts/postbuild.mjs.
import { prerender } from "react-dom/static"
import App from "./App"
import { loadOverlay } from "./i18n/overlays"
import { parsePath, setServerPath } from "./lib/router"
import { headTags } from "./seo"

export { routes, pathFor } from "./lib/router"
export { LANGS } from "./i18n/lang"
export { sitemap } from "./seo"

export async function renderPage(template: string, path: string) {
  setServerPath(path)
  const { lang, route } = parsePath(path)
  await loadOverlay(lang)
  const { prelude } = await prerender(<App />)
  const body = await new Response(prelude).text()
  return template
    .replace('<html lang="en">', `<html lang="${lang}">`)
    .replace(/<!--head-->[\s\S]*<!--\/head-->/, headTags(route, lang))
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
}
