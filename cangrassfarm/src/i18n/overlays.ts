import type { Content } from "./content"
import type { Lang } from "./lang"

// The Hindi and Punjabi plant text is big, so it's fetched only when someone picks that language.
const cache: Partial<Record<Lang, Content>> = {}

export const overlay = (lang: Lang) => cache[lang]

export async function loadOverlay(lang: Lang) {
  if (lang === "en" || cache[lang]) return
  cache[lang] = lang === "hi" ? (await import("./content.hi")).hi : (await import("./content.pa")).pa
}
