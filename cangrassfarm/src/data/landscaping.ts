export type GrassId = "canadian" | "bermuda" | "golf" | "all-season" | "winter"

export type Grass = {
  id: GrassId
  name: string
  tagline: string
  look: string
  sun: string
  soil: string
  water: string
  traffic: string
  season: string
  bestFor: string[]
  hue: string
}

export const grasses: Grass[] = [
  {
    id: "canadian",
    name: "Canadian Grass",
    tagline: "Soft, dense, carpet-like home lawn",
    look: "Fine blades, deep emerald colour, cushiony underfoot",
    sun: "Full sun to light shade (4–6 hours)",
    soil: "Loamy, fertile soil with good drainage",
    water: "Regular, 2–3 deep waterings a week in summer",
    traffic: "Medium. Family lawns and gatherings",
    season: "Lush from autumn to spring; needs care in peak summer",
    bestFor: ["Home front lawns", "Kothi and farmhouse lawns", "Lawns kids play barefoot on"],
    hue: "#1f9d55",
  },
  {
    id: "bermuda",
    name: "Bermuda Grass",
    tagline: "Tough, heat-proof and self-repairing",
    look: "Medium-fine blades, bright green, spreads by runners",
    sun: "Full sun only (6+ hours)",
    soil: "Handles sandy, clay and mildly saline or alkaline soils",
    water: "Low to moderate. Survives dry spells",
    traffic: "Very high. Sports, play areas, public parks",
    season: "Peak green from March to November; browns in frost and recovers in spring",
    bestFor: ["Playgrounds and sports areas", "Large estates", "Low-water sites"],
    hue: "#65a30d",
  },
  {
    id: "golf",
    name: "Golf Grass",
    tagline: "Ultra-fine, low-mown showpiece turf",
    look: "Very fine, dense, velvet-smooth surface",
    sun: "Full sun only (6–8 hours)",
    soil: "Sandy loam that drains fast; a prepared base is recommended",
    water: "Frequent, light watering; best with sprinklers",
    traffic: "High, but needs regular mowing and feeding",
    season: "Best from March to November",
    bestFor: ["Putting greens", "Hotels and resorts", "Premium show lawns"],
    hue: "#16a34a",
  },
  {
    id: "all-season",
    name: "All Season Grass",
    tagline: "Green twelve months a year",
    look: "Medium blades, rich green that stays green through the seasons",
    sun: "Full to partial sun (4+ hours)",
    soil: "Most garden soils; loam is ideal",
    water: "Moderate and steady",
    traffic: "Medium to high",
    season: "Year-round colour through Punjab's hot summers and cold winters",
    bestFor: ["Anyone who wants green all year", "Commercial frontages", "Schools and offices"],
    hue: "#0f766e",
  },
  {
    id: "winter",
    name: "Winter Grass",
    tagline: "Fast, brilliant green for the cold season",
    look: "Glossy, soft blades that sprout within a week",
    sun: "Full to partial sun",
    soil: "Any well-prepared soil; also overseeds onto dormant Bermuda",
    water: "Moderate",
    traffic: "Medium",
    season: "October to March only; fades in summer heat",
    bestFor: ["Winter weddings and events", "Overseeding dormant lawns", "Quick seasonal makeovers"],
    hue: "#22c55e",
  },
]

export type Sun = "full" | "partial" | "shade"
export type Soil = "loamy" | "sandy" | "clay" | "saline"
export type Use = "family" | "sports" | "showpiece" | "event"
export type Water = "plenty" | "limited"
export type Need = "year-round" | "winter-only"

export type SiteAnswers = { sun: Sun; soil: Soil; use: Use; water: Water; need: Need }

type Score = { id: GrassId; score: number; reasons: string[] }

// Simple weighted rules that mirror the advice Moaviz gives on a site visit.
export function recommendGrass(a: SiteAnswers): Score[] {
  const s: Record<GrassId, Score> = {
    canadian: { id: "canadian", score: 0, reasons: [] },
    bermuda: { id: "bermuda", score: 0, reasons: [] },
    golf: { id: "golf", score: 0, reasons: [] },
    "all-season": { id: "all-season", score: 0, reasons: [] },
    winter: { id: "winter", score: 0, reasons: [] },
  }
  const add = (id: GrassId, pts: number, why?: string) => {
    s[id].score += pts
    if (why && pts > 0) s[id].reasons.push(why)
  }

  if (a.need === "winter-only") {
    add("winter", 6, "You only need green from October to March")
  } else {
    add("winter", -6)
    add("all-season", 2, "Stays green every month of the year")
  }

  if (a.sun === "full") {
    add("bermuda", 3, "Bermuda thrives in 6+ hours of direct sun")
    add("golf", 2, "Golf turf needs full sun to stay dense")
    add("canadian", 1)
    add("all-season", 1)
  } else if (a.sun === "partial") {
    add("canadian", 3, "Handles 4–6 hours of sun well")
    add("all-season", 3, "Tolerates partial shade")
    add("winter", 1)
    add("bermuda", -3)
    add("golf", -3)
  } else {
    add("all-season", 2, "The most shade-tolerant option we stock")
    add("canadian", 1, "Copes with light shade if mowed a little higher")
    add("winter", 1)
    add("bermuda", -5)
    add("golf", -5)
  }

  if (a.soil === "loamy") {
    add("canadian", 2, "Loamy soil suits fine-bladed lawns")
    add("golf", 1)
    add("all-season", 1)
  } else if (a.soil === "sandy") {
    add("bermuda", 2, "Bermuda roots deep in fast-draining sandy soil")
    add("golf", 2, "Golf turf prefers sandy, free-draining beds")
  } else if (a.soil === "clay") {
    add("bermuda", 2, "Bermuda tolerates heavy clay")
    add("all-season", 1)
    add("golf", -2)
  } else {
    add("bermuda", 4, "Bermuda is the most salt and alkali tolerant grass")
    add("canadian", -2)
    add("golf", -2)
  }

  if (a.use === "family") {
    add("canadian", 3, "Soft and cushiony for family time")
    add("all-season", 2)
  } else if (a.use === "sports") {
    add("bermuda", 4, "Self-repairs quickly under heavy foot traffic")
    add("golf", 1)
  } else if (a.use === "showpiece") {
    add("golf", 4, "Velvet-smooth, premium finish")
    add("canadian", 2)
  } else {
    add("winter", 3, "Fast germination for an event-ready lawn")
    add("all-season", 1)
  }

  if (a.water === "limited") {
    add("bermuda", 3, "Needs the least water once established")
    add("golf", -3)
    add("canadian", -1)
  } else {
    add("golf", 1)
    add("canadian", 1)
  }

  return Object.values(s).sort((x, y) => y.score - x.score)
}

export type Space = "courtyard" | "front-yard" | "farmhouse" | "commercial"

export const spaces: { id: Space; label: string; size: string; ideas: string[] }[] = [
  {
    id: "courtyard",
    label: "Terrace & courtyard",
    size: "Up to 500 sq ft",
    ideas: ["Raised planters and vertical green walls", "A compact lawn patch or stepping stones in grass", "Potted fragrant climbers for privacy"],
  },
  {
    id: "front-yard",
    label: "Home front yard",
    size: "500–3,000 sq ft",
    ideas: ["A clean central lawn framed by flower borders", "Pathway edging with seasonal flowers", "A feature tree or palm at the entrance"],
  },
  {
    id: "farmhouse",
    label: "Farmhouse & estate",
    size: "Quarter acre and up",
    ideas: ["Wide open lawns for events and play", "Boundary hedges and avenue trees", "Kitchen garden and flower meadows"],
  },
  {
    id: "commercial",
    label: "Hotel, school & office",
    size: "Any size",
    ideas: ["A durable lawn for heavy foot traffic", "Low-maintenance colour beds", "Indoor plant styling for lobbies"],
  },
]

export const exposure: Record<Sun, { label: string; hours: string; plants: string[]; note: string }> = {
  full: {
    label: "Full sun",
    hours: "6+ hours of direct sun",
    plants: ["Rose", "Bougainvillea", "Hibiscus", "Marigold", "Zinnia", "Lavender"],
    note: "Plan shade for people with a pergola or tree, and give lawns deep, less frequent watering.",
  },
  partial: {
    label: "Partial sun",
    hours: "3–6 hours, often morning",
    plants: ["Pansy", "Lily", "Balsam", "Coleus", "Orchid", "Money Palm"],
    note: "Morning sun with afternoon shade is ideal for most flowers in Punjab's summers.",
  },
  shade: {
    label: "Shade",
    hours: "Under 3 hours",
    plants: ["Ferns", "Begonia", "Impatiens", "Coleus", "Money Palm"],
    note: "Use foliage texture and pale flowers to brighten the space; keep lawns to the sunniest strip.",
  },
}

export const grassForSpace: Record<Space, Record<Sun, GrassId>> = {
  courtyard: { full: "canadian", partial: "all-season", shade: "all-season" },
  "front-yard": { full: "canadian", partial: "all-season", shade: "all-season" },
  farmhouse: { full: "bermuda", partial: "all-season", shade: "all-season" },
  commercial: { full: "bermuda", partial: "all-season", shade: "all-season" },
}

export const projects = [
  { img: "/img/scenes/lawn.webp", title: "Open lawn installation", kind: "Lawn", grass: "Canadian Grass" },
  { img: "/img/scenes/garden.webp", title: "Stepping-stone garden walk", kind: "Garden design", grass: "All Season Grass" },
  { img: "/img/scenes/indoor-outdoor.webp", title: "Conifer & pot styling", kind: "Planting", grass: "—" },
  { img: "/img/scenes/seasonal.webp", title: "Seasonal flower beds", kind: "Nursery", grass: "—" },
  { img: "/img/scenes/all-kinds.webp", title: "Our growing houses", kind: "Nursery", grass: "—" },
]
