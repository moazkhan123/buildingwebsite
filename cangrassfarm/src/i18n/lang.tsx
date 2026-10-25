import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { loadOverlay } from "./overlays"

export type Lang = "en" | "hi" | "pa"

export const LANGS: { id: Lang; label: string; short: string }[] = [
  { id: "en", label: "English", short: "EN" },
  { id: "hi", label: "हिंदी", short: "हि" },
  { id: "pa", label: "ਪੰਜਾਬੀ", short: "ਪੰ" },
]

const KEY = "cgf-lang"
const isLang = (v: unknown): v is Lang => v === "en" || v === "hi" || v === "pa"

// ?lang= in the link wins, then the visitor's saved choice, then their device language.
export function initialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get("lang")
  if (isLang(fromUrl)) return fromUrl
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
  const setLang = (l: Lang) => {
    loadOverlay(l).finally(() => setLangNow(l))
  }
  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(KEY, lang)
    } catch {
      /* storage unavailable */
    }
  }, [lang])
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
