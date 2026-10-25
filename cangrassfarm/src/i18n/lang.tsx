import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { currentPath, parsePath, pathFor, type Route } from "@/lib/router"
import { loadOverlay } from "./overlays"

export type Lang = "en" | "hi" | "pa"

export const LANGS: { id: Lang; label: string; short: string }[] = [
  { id: "en", label: "English", short: "EN" },
  { id: "hi", label: "हिंदी", short: "हि" },
  { id: "pa", label: "ਪੰਜਾਬੀ", short: "ਪੰ" },
]

const KEY = "cgf-lang"
const isLang = (v: unknown): v is Lang => v === "en" || v === "hi" || v === "pa"

// A /hi/ or /pa/ URL wins, then an old ?lang= link, then the visitor's saved choice, then their device language.
export function initialLang(): Lang {
  const fromPath = parsePath(currentPath()).lang
  if (fromPath !== "en" || typeof window === "undefined") return fromPath
  const fromQuery = new URLSearchParams(window.location.search).get("lang")
  if (isLang(fromQuery)) return fromQuery
  try {
    const saved = localStorage.getItem(KEY)
    if (isLang(saved)) return saved
  } catch {
    /* storage unavailable */
  }
  for (const l of navigator.languages ?? [navigator.language]) {
    const code = l.toLowerCase().slice(0, 2)
    if (code === "hi" || code === "pa") return code
  }
  return "en"
}

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "en", setLang: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangNow] = useState<Lang>(initialLang)
  // Switch only once the language's text has arrived, so the page never shows a half-translated mix.
  const switchTo = (l: Lang) => loadOverlay(l).finally(() => setLangNow(l))
  // A visitor's own switch gets a history entry, so Back returns to the previous language.
  const setLang = (l: Lang) => {
    const path = pathFor(parsePath(window.location.pathname).route, l)
    if (path !== window.location.pathname) window.history.pushState({}, "", path + window.location.hash)
    switchTo(l)
  }

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(KEY, lang)
    } catch {
      /* storage unavailable */
    }
    // Keep the address bar on this language's URL (also tidies old ?lang= links).
    const path = pathFor(parsePath(window.location.pathname).route, lang)
    if (path !== window.location.pathname || window.location.search) {
      window.history.replaceState({}, "", path + window.location.hash)
    }
  }, [lang])

  // Back/forward between languages.
  useEffect(() => {
    const onPop = () => switchTo(parsePath(window.location.pathname).lang)
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)

/** Link target for a page in the current language. */
export function useHref() {
  const { lang } = useLang()
  return (route: Route) => pathFor(route, lang)
}
