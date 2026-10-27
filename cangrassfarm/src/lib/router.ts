import { useEffect, useState } from "react"
import type { Lang } from "@/i18n/lang"

export type Route = "/" | "/landscaping" | "/contact"
export const routes: Route[] = ["/", "/landscaping", "/contact"]

// Each language has its own URLs so search engines can index them:
// /, /landscaping, /contact (English), then the same under /hi/ and /pa/.
let serverPath: string | null = null
/** Set while prerendering pages at build time, where there is no window. */
export const setServerPath = (p: string) => {
  serverPath = p
}
export const currentPath = () => serverPath ?? window.location.pathname

export function parsePath(path: string): { lang: Lang; route: Route } {
  const m = path.match(/^\/(hi|pa)(?=\/|$)/)
  const lang: Lang = m ? (m[1] as Lang) : "en"
  const rest = (m ? path.slice(m[0].length) : path).replace(/\/+$/, "")
  return { lang, route: rest === "/landscaping" || rest === "/contact" ? rest : "/" }
}

export function pathFor(route: Route, lang: Lang) {
  if (lang === "en") return route
  return route === "/" ? `/${lang}/` : `/${lang}${route}`
}

/** Go to a page (optionally with #section) in the language currently in the URL. */
export function navigate(to: string) {
  const [route, hash] = to.split("#")
  const path = pathFor((route || "/") as Route, parsePath(window.location.pathname).lang)
  if (path !== window.location.pathname) {
    window.history.pushState({}, "", path + (hash ? `#${hash}` : ""))
    window.dispatchEvent(new PopStateEvent("popstate"))
    window.scrollTo({ top: 0 })
  }
  if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }))
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(() => parsePath(currentPath()).route)
  useEffect(() => {
    const onPop = () => setRoute(parsePath(window.location.pathname).route)
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])
  return route
}
