import { useMemo } from "react"
import { flowers as enFlowers, type Flower } from "@/data/flowers"
import {
  concepts as enConcepts,
  exposure as enExposure,
  grasses as enGrasses,
  projects as enProjects,
  spaces as enSpaces,
  type Concept,
  type Grass,
  type GrassId,
  type Space,
  type Sun,
} from "@/data/landscaping"
import { useLang } from "./lang"
import { overlay } from "./overlays"
import { ui, type UI } from "./ui"

// Hindi and Punjabi text, keyed by the ids of the English data, which stays the source of truth
// for everything that isn't words (images, tags, scores).
export type FlowerText = { name: string; tagline: string; benefits: string[]; uses: string[]; care: string; caution?: string }
export type GrassText = Pick<Grass, "name" | "tagline" | "look" | "sun" | "soil" | "water" | "traffic" | "season" | "bestFor">
export type Content = {
  flowers: Record<string, FlowerText>
  grasses: Record<GrassId, GrassText>
  spaces: Record<Space, { label: string; size: string; ideas: string[] }>
  exposure: Record<Sun, { label: string; hours: string; note: string }>
  projects: { title: string; kind: string }[]
  concepts: Record<string, { title: string; plants: string; text: string }>
}

/** A flower in the visitor's language; `en` keeps the English name for search and orders. */
export type LocalFlower = Flower & { en: string; search: string }

export const useT = (): UI => ui[useLang().lang]

export function useContent() {
  const { lang } = useLang()
  return useMemo(() => {
    // Falls back to English text if the language file failed to load.
    const c = overlay(lang)

    const flowers: LocalFlower[] = enFlowers.map((f) => {
      const tr = c?.flowers[f.slug]
      const lf: Flower = tr
        ? {
            ...f,
            name: tr.name,
            local: f.name,
            tagline: tr.tagline,
            benefits: tr.benefits,
            uses: f.uses.map((u, i) => ({ kind: u.kind, text: tr.uses[i] ?? u.text })),
            care: tr.care,
            caution: tr.caution,
          }
        : f
      // Search matches English, the Hindi/Punjabi name and the use text, so "gulab", "rose" and "गुलाब" all work.
      const search = [f.name, f.local, ...f.uses.map((u) => u.text), lf.name, ...lf.uses.map((u) => u.text)].join(" ").toLowerCase()
      return { ...lf, en: f.name, search }
    })
    const flowerName = (en: string) => flowers.find((f) => f.en === en)?.name ?? en

    const grasses: Grass[] = enGrasses.map((g) => (c ? { ...g, ...c.grasses[g.id] } : g))
    const grassName = (id: GrassId) => grasses.find((g) => g.id === id)!.name

    const spaces = enSpaces.map((s) => (c ? { ...s, ...c.spaces[s.id] } : s))

    const exposure = Object.fromEntries(
      (Object.keys(enExposure) as Sun[]).map((k) => {
        const e = enExposure[k]
        return [k, { ...e, ...c?.exposure[k], plants: e.plants.map(flowerName) }]
      }),
    ) as typeof enExposure

    const projects = enProjects.map((p, i) => {
      const g = enGrasses.find((x) => x.name === p.grass)
      return { ...p, ...c?.projects[i], grass: g ? grassName(g.id) : p.grass }
    })

    const concepts: Concept[] = enConcepts.map((x) => (c ? { ...x, ...c.concepts[x.id] } : x))

    return { flowers, flowerName, grasses, grassName, spaces, exposure, projects, concepts }
  }, [lang])
}
