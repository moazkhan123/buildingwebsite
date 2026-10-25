import { AnimatePresence, motion } from "motion/react"
import { Check, CloudSun, Droplets, Footprints, Layers, Phone, Ruler, Shovel, Snowflake, Sprout, Sun, SunDim, Thermometer, Trees, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import {
  conceptFor,
  concepts,
  exposure,
  grasses,
  projects,
  recommendGrass,
  spaces,
  type Concept,
  type Grass,
  type SiteAnswers,
  type Space,
  type Sun as SunLevel,
} from "@/data/landscaping"
import { cn } from "@/lib/cn"
import { PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/lib/contact"
import { DewDrops, GrassField } from "@/components/Ambient"
import { GelButton, GelSegment, Reveal, SectionHeading, spring } from "@/components/ui/gel"
import { GradientBackground } from "@/components/ui/jade-sky"

const grassById = (id: string) => grasses.find((g) => g.id === id)!
const sunIcons = { full: Sun, partial: CloudSun, shade: SunDim } as const

function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-10 sm:pt-16" aria-labelledby="land-title">
      {/* Jade Sky: a faint glow over the hero lawn, dimmed so it sits on the dark Aurora theme */}
      <div className="absolute inset-0 -z-10 opacity-15 [mask-image:linear-gradient(to_bottom,transparent,black_30%)]">
        <GradientBackground />
      </div>
      <DewDrops />
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="gel mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary"
        >
          <Trees className="size-4" aria-hidden /> Landscaping by Moaviz
        </motion.p>
        <motion.h1
          id="land-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance text-4xl font-bold sm:text-6xl"
        >
          Lawns and gardens designed around{" "}
          <span className="bg-gradient-to-r from-primary via-primary-2 to-sun bg-clip-text text-transparent">your soil, sun and season.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground"
        >
          We study your space, how much sun it gets, your soil and how you'll use it, then pick the grass and plants that will thrive there. Not just the ones that look good on day one.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <GelButton href={PHONE_TEL} className="px-6 text-base">
            <Phone className="size-4" aria-hidden /> Hire Moaviz · {PHONE_DISPLAY}
          </GelButton>
          <GelButton href="#grass-finder" variant="glass" className="px-6 text-base">
            <Sprout className="size-4" aria-hidden /> Find your grass
          </GelButton>
        </motion.div>
      </div>
      <GrassField className="mt-14" height={90} />
    </section>
  )
}

function Projects() {
  const [open, setOpen] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (open === null) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null)
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % projects.length))
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + projects.length) % projects.length))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <section id="projects" className="scroll-mt-24 px-4 pt-20 sm:px-6" aria-labelledby="projects-title">
      <SectionHeading eyebrow="Our work" title="Projects & nursery" id="projects-title">
        A look at the lawns, gardens and growing houses we look after.
      </SectionHeading>
      <ul className="mx-auto grid max-w-6xl auto-rows-[220px] grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {projects.map((p, i) => (
          <motion.li
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className={cn(i === 0 && "col-span-2 row-span-2")}
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`View ${p.title}`}
              className="gel group relative block h-full w-full cursor-pointer overflow-hidden rounded-[1.75rem] p-1.5"
            >
              <motion.img
                layoutId={`project-${i}`}
                src={p.img}
                alt=""
                loading="lazy"
                className="h-full w-full rounded-[1.4rem] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="gel absolute inset-x-3 bottom-3 rounded-2xl px-3 py-2 text-left">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-primary">{p.kind}</span>
                <span className="block font-serif font-semibold">{p.title}</span>
              </span>
            </button>
          </motion.li>
        ))}
      </ul>
      {createPortal(
      <AnimatePresence>
        {open !== null && (
          <div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-8">
            <motion.div
              className="absolute inset-0 bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(null)}
            />
            <motion.figure
              role="dialog"
              aria-modal="true"
              aria-label={projects[open].title}
              className="gel relative w-full max-w-4xl rounded-[2rem] p-2"
              style={{ background: "color-mix(in srgb, var(--background) 92%, transparent)" }}
            >
              <motion.img layoutId={`project-${open}`} src={projects[open].img} alt={projects[open].title} className="max-h-[75dvh] w-full rounded-[1.6rem] object-cover" />
              <figcaption className="flex flex-wrap items-center justify-between gap-2 px-3 py-3">
                <span>
                  <span className="font-serif text-lg font-semibold">{projects[open].title}</span>
                  {projects[open].grass !== "—" && <span className="ml-2 text-sm text-muted-foreground">Grass: {projects[open].grass}</span>}
                </span>
                <span className="text-xs text-muted-foreground">← → to browse · Esc to close</span>
              </figcaption>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="gel absolute right-4 top-4 grid size-11 cursor-pointer place-items-center rounded-full"
              >
                <X className="size-5" aria-hidden />
              </button>
            </motion.figure>
          </div>
        )}
      </AnimatePresence>,
        document.body,
      )}
    </section>
  )
}

function ConceptPlanner() {
  const [space, setSpace] = useState<Space>("front-yard")
  const [sun, setSun] = useState<SunLevel>("full")
  const [picked, setPicked] = useState<Concept | null>(null)
  const s = spaces.find((x) => x.id === space)!
  const e = exposure[sun]
  // A concept tapped in the gallery wins until the visitor changes space or sun.
  const c = picked && picked.space === space && picked.sun === sun ? picked : concepts.find((x) => x.id === conceptFor[space][sun])!
  const g = grassById(c.grass ?? "all-season")
  const SunIcon = sunIcons[sun]

  const pick = (x: Concept) => {
    setPicked(x)
    setSpace(x.space)
    setSun(x.sun)
    document.getElementById("concept-result")?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  return (
    <section id="concepts" className="scroll-mt-24 px-4 pt-24 sm:px-6" aria-labelledby="concepts-title">
      <SectionHeading eyebrow="Design concepts" title="Concepts based on your space and sunlight" id="concepts-title">
        Pick your type of space and how much sun it gets to see the layout, plants and lawn we'd usually start from.
      </SectionHeading>
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Reveal className="space-y-5">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-bold">
              <Ruler className="size-4 text-primary" aria-hidden /> Your space
            </p>
            <div role="radiogroup" aria-label="Your space" className="grid grid-cols-2 gap-2">
              {spaces.map((x) => {
                const active = x.id === space
                return (
                  <button
                    key={x.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSpace(x.id)}
                    className={cn(
                      "relative min-h-16 cursor-pointer rounded-2xl p-3 text-left transition-colors duration-200",
                      active ? "text-on-primary" : "gel hover:text-foreground",
                    )}
                  >
                    {active && <motion.span layoutId="space-pill" transition={spring} className="gel-btn absolute inset-0 rounded-2xl" />}
                    <span className="relative block text-sm font-bold">{x.label}</span>
                    <span className={cn("relative block text-xs", active ? "opacity-90" : "text-muted-foreground")}>{x.size}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-bold">
              <Sun className="size-4 text-accent" aria-hidden /> Sun exposure
            </p>
            <GelSegment
              name="sun"
              label="Sun exposure"
              value={sun}
              onChange={setSun}
              options={[
                { id: "full", label: "Full sun" },
                { id: "partial", label: "Partial" },
                { id: "shade", label: "Shade" },
              ]}
            />
            <p className="mt-2 text-xs text-muted-foreground">{e.hours}</p>
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={c.id + space + sun}
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)", transition: { duration: 0.15 } }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            id="concept-result"
            className="gel relative scroll-mt-24 overflow-hidden rounded-[2rem] p-6 sm:p-8"
            aria-live="polite"
          >
            <figure className="relative -mx-4 -mt-4 mb-5 overflow-hidden rounded-[1.6rem] sm:-mx-6 sm:-mt-6">
              <img src={c.img} alt={c.title} width={c.width} height={c.height} className="aspect-[16/9] w-full object-cover" />
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent" aria-hidden />
              <figcaption className="gel absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-bold">{c.title}</figcaption>
            </figure>
            <div className="absolute -right-10 -top-10 size-40 rounded-full opacity-30 blur-2xl" style={{ background: sun === "shade" ? "var(--primary)" : "var(--sun)" }} aria-hidden />
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <SunIcon className="size-4" aria-hidden /> {e.label} · {s.label}
            </p>
            <h3 className="mt-2 text-2xl font-semibold">Concept for your {s.label.toLowerCase()}</h3>
            <ul className="mt-4 space-y-2">
              {s.ideas.map((idea) => (
                <li key={idea} className="flex gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /> {idea}
                </li>
              ))}
            </ul>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[var(--glass-tint)] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Suggested lawn</p>
                <p className="mt-1 flex items-center gap-2 font-serif text-lg font-semibold">
                  <span className="size-3 rounded-full" style={{ background: g.hue }} aria-hidden /> {g.name}
                </p>
                <p className="text-sm text-muted-foreground">{g.tagline}</p>
              </div>
              <div className="rounded-2xl bg-[var(--glass-tint)] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Plants that will thrive</p>
                <p className="mt-1 text-sm font-semibold">{e.plants.join(", ")}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{e.note}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <ConceptGallery onPick={pick} />
    </section>
  )
}

const spaceLabel = Object.fromEntries(spaces.map((x) => [x.id, x.label])) as Record<Space, string>

function ConceptGallery({ onPick }: { onPick: (c: Concept) => void }) {
  const [filter, setFilter] = useState<SunLevel | "all">("all")
  const [expanded, setExpanded] = useState(false)
  const matching = concepts.filter((c) => filter === "all" || c.sun === filter)
  const shown = expanded || filter !== "all" ? matching : matching.slice(0, 9)

  return (
    <div className="mx-auto mt-16 max-w-6xl">
      <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div>
          <h3 className="text-2xl font-semibold">Concept gallery</h3>
          <p className="text-sm text-muted-foreground">Tap a look you like to load it into the planner above.</p>
        </div>
        <div className="w-full sm:w-auto sm:min-w-96">
          <GelSegment
            name="gallery-sun"
            label="Filter concepts by sunlight"
            value={filter}
            onChange={setFilter}
            options={[
              { id: "all", label: "All" },
              { id: "full", label: "Full sun" },
              { id: "partial", label: "Partial" },
              { id: "shade", label: "Shade" },
            ]}
          />
        </div>
      </div>
      <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((c) => {
            const SunIcon = sunIcons[c.sun]
            return (
              <motion.li
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
                transition={spring}
              >
                <motion.button
                  type="button"
                  onClick={() => onPick(c)}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  transition={spring}
                  className="gel group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-[1.75rem] p-1.5 text-left"
                  aria-label={`Load concept: ${c.title}`}
                >
                  <span className="relative block overflow-hidden rounded-[1.4rem]">
                    <img
                      src={c.img}
                      alt={c.title}
                      width={c.width}
                      height={c.height}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="gel absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold">
                      <SunIcon className="size-3.5 text-accent" aria-hidden /> {exposure[c.sun].label}
                    </span>
                  </span>
                  <span className="flex flex-1 flex-col px-3 pb-3 pt-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">{spaceLabel[c.space]}</span>
                    <span className="font-serif text-lg font-semibold">{c.title}</span>
                    <span className="mt-1 text-sm text-muted-foreground">{c.text}</span>
                    <span className="mt-3 flex flex-wrap gap-1.5 text-xs font-semibold">
                      <span className="rounded-full bg-[var(--glass-tint)] px-2.5 py-1">{c.grass ? grassById(c.grass).name : "No lawn: pavers & mulch"}</span>
                      <span className="rounded-full bg-[var(--glass-tint)] px-2.5 py-1">{c.plants}</span>
                    </span>
                  </span>
                </motion.button>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </motion.ul>
      {filter === "all" && matching.length > 9 && (
        <div className="mt-8 flex justify-center">
          <GelButton
            href="#concepts"
            variant="glass"
            aria-expanded={expanded}
            onClick={(e) => {
              e.preventDefault()
              setExpanded((v) => !v)
            }}
          >
            {expanded ? "Show fewer concepts" : `Show all ${matching.length} concepts`}
          </GelButton>
        </div>
      )}
    </div>
  )
}

const questions: { key: keyof SiteAnswers; label: string; icon: typeof Sun; options: { id: string; label: string }[] }[] = [
  {
    key: "sun",
    label: "How much direct sun does the lawn get?",
    icon: Sun,
    options: [
      { id: "full", label: "6+ hours" },
      { id: "partial", label: "3–6 hours" },
      { id: "shade", label: "Under 3" },
    ],
  },
  {
    key: "soil",
    label: "What is your soil like? (salty = kallar / alkaline)",
    icon: Layers,
    options: [
      { id: "loamy", label: "Loamy" },
      { id: "sandy", label: "Sandy" },
      { id: "clay", label: "Clay" },
      { id: "saline", label: "Salty" },
    ],
  },
  {
    key: "use",
    label: "How will the lawn be used?",
    icon: Footprints,
    options: [
      { id: "family", label: "Family" },
      { id: "sports", label: "Sports" },
      { id: "showpiece", label: "Show lawn" },
      { id: "event", label: "Event" },
    ],
  },
  {
    key: "water",
    label: "How much water is available?",
    icon: Droplets,
    options: [
      { id: "plenty", label: "Plenty" },
      { id: "limited", label: "Limited" },
    ],
  },
  {
    key: "need",
    label: "When do you want it green?",
    icon: Thermometer,
    options: [
      { id: "year-round", label: "All year" },
      { id: "winter-only", label: "Winter only" },
    ],
  },
]

function GrassFinder() {
  const [a, setA] = useState<SiteAnswers>({ sun: "full", soil: "loamy", use: "family", water: "plenty", need: "year-round" })
  const ranked = useMemo(() => recommendGrass(a), [a])
  const best = grassById(ranked[0].id)
  const runnerUp = grassById(ranked[1].id)
  const max = Math.max(...ranked.map((r) => r.score), 1)

  return (
    <section id="grass-finder" className="scroll-mt-24 px-4 pt-24 sm:px-6" aria-labelledby="finder-title">
      <SectionHeading eyebrow="Grass finder" title="Which grass suits your soil, light and weather?" id="finder-title">
        Answer five quick questions. We weigh sunlight, soil, use, water and season the same way we do on a site visit.
      </SectionHeading>
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Reveal className="gel space-y-5 rounded-[2rem] p-5 sm:p-7">
          {questions.map((q) => (
            <div key={q.key}>
              <p className="mb-2 flex items-center gap-2 text-sm font-bold">
                <q.icon className="size-4 text-primary" aria-hidden /> {q.label}
              </p>
              <GelSegment name={q.key} label={q.label} value={a[q.key]} onChange={(v) => setA((p) => ({ ...p, [q.key]: v }))} options={q.options} />
            </div>
          ))}
        </Reveal>

        <div className="space-y-4" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={best.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
              transition={spring}
              className="gel relative overflow-hidden rounded-[2rem] p-6"
            >
              <div className="absolute -right-12 -top-12 size-44 rounded-full opacity-40 blur-2xl" style={{ background: best.hue }} aria-hidden />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Best match</p>
              <h3 className="mt-1 text-3xl font-semibold">{best.name}</h3>
              <p className="text-muted-foreground">{best.tagline}</p>
              <ul className="mt-4 space-y-1.5">
                {ranked[0].reasons.map((r) => (
                  <li key={r} className="flex gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /> {r}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm">
                <span className="font-semibold">Also consider:</span> {runnerUp.name}
              </p>
              <GelButton
                href={whatsappLink(
                  `Hi Moaviz, the grass finder on cangrassfarm.com suggested ${best.name} for my lawn (sun: ${a.sun}, soil: ${a.soil}, use: ${a.use}, water: ${a.water}, season: ${a.need}). Can you visit and quote?`,
                )}
                target="_blank"
                rel="noopener"
                className="mt-5 w-full"
              >
                Get a quote for {best.name}
              </GelButton>
            </motion.div>
          </AnimatePresence>

          <div className="gel rounded-[2rem] p-5">
            <p className="mb-3 text-sm font-bold">How each grass scores for your site</p>
            <ul className="space-y-2.5">
              {ranked.map((r) => {
                const g = grassById(r.id)
                const pct = Math.max(4, (Math.max(r.score, 0) / max) * 100)
                return (
                  <motion.li key={r.id} layout transition={spring} className="text-sm">
                    <div className="mb-1 flex justify-between">
                      <span className="font-semibold">{g.name}</span>
                      <span className="tabular-nums text-muted-foreground">{Math.round(Math.max(r.score, 0) / max * 100)}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-[var(--glass-tint)]">
                      <motion.div
                        className="h-full origin-left rounded-full"
                        style={{ background: `linear-gradient(90deg, ${g.hue}, var(--primary-2))` }}
                        initial={false}
                        animate={{ scaleX: pct / 100 }}
                        transition={spring}
                      />
                    </div>
                  </motion.li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function GrassCard({ g, i, className }: { g: Grass; i: number; className?: string }) {
  const rows = [
    { icon: Sun, label: "Sunlight", v: g.sun },
    { icon: Layers, label: "Soil", v: g.soil },
    { icon: Droplets, label: "Water", v: g.water },
    { icon: Footprints, label: "Traffic", v: g.traffic },
    { icon: g.id === "winter" ? Snowflake : Thermometer, label: "Season", v: g.season },
  ]
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: i * 0.06 }}
      whileHover={{ y: -6 }}
      className={cn("gel relative flex flex-col overflow-hidden rounded-[2rem] p-6", className)}
    >
      <div aria-hidden className="absolute inset-x-0 top-0 h-20 opacity-90" style={{ background: `linear-gradient(180deg, ${g.hue}55, transparent)` }} />
      <div aria-hidden className="relative -mx-6 -mt-6 mb-2 overflow-hidden" style={{ ["--blade-1" as string]: g.hue, ["--blade-2" as string]: g.hue + "cc", ["--blade-3" as string]: g.hue + "99" }}>
        <GrassField height={46} density={g.id === "golf" ? 220 : g.id === "bermuda" ? 120 : 160} />
      </div>
      <h3 className="relative text-2xl font-semibold">{g.name}</h3>
      <p className="relative text-sm font-semibold text-primary">{g.tagline}</p>
      <p className="mt-2 text-sm text-muted-foreground">{g.look}</p>
      <dl className="mt-4 space-y-2 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-2">
            <r.icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <dt className="sr-only">{r.label}</dt>
            <dd>{r.v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {g.bestFor.map((b) => (
          <span key={b} className="rounded-full bg-[var(--glass-tint)] px-2.5 py-1 text-xs font-semibold">
            {b}
          </span>
        ))}
      </div>
    </motion.li>
  )
}

function GrassCatalog() {
  return (
    <section id="grasses" className="scroll-mt-24 px-4 pt-24 sm:px-6" aria-labelledby="grasses-title">
      <SectionHeading eyebrow="Our grasses" title="Five lawn grasses, each for a different job" id="grasses-title" />
      <ul className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {grasses.map((g, i) => (
          <GrassCard key={g.id} g={g} i={i} className={i < 3 ? "lg:col-span-2" : "lg:col-span-3"} />
        ))}
      </ul>
    </section>
  )
}

const steps = [
  { icon: Phone, title: "Call Moaviz", text: "Tell us about your space and what you have in mind." },
  { icon: Ruler, title: "Site visit", text: "We check sunlight, soil, drainage and how you'll use the space." },
  { icon: Layers, title: "Concept & quote", text: "A layout, grass and plant list with a clear price." },
  { icon: Shovel, title: "Install & care", text: "Soil prep, levelling, turf, planting and aftercare guidance." },
]

function Process() {
  return (
    <section className="px-4 pt-24 sm:px-6" aria-labelledby="process-title">
      <SectionHeading eyebrow="How we work" title="From bare ground to green in four steps" id="process-title" />
      <ol className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <motion.li
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="gel relative rounded-[1.75rem] p-5"
          >
            <span className="absolute right-5 top-4 font-serif text-4xl font-bold text-primary/20" aria-hidden>
              {i + 1}
            </span>
            <span className="gel-btn grid size-11 place-items-center rounded-2xl">
              <s.icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}

function Hire() {
  return (
    <section className="px-4 pt-24 sm:px-6">
      <Reveal className="gel relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] px-6 py-12 text-center sm:px-12">
        <DewDrops count={10} />
        <h2 className="text-balance text-3xl font-semibold sm:text-4xl">Ready to start your landscaping project?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Homes, farmhouses, schools, hotels and wedding venues across Malerkotla and Punjab. Call Moaviz to book a site visit.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <GelButton href={PHONE_TEL} className="px-6 text-base">
            <Phone className="size-4" aria-hidden /> {PHONE_DISPLAY}
          </GelButton>
          <GelButton href={whatsappLink("Hi Moaviz, I'd like to discuss a landscaping project.")} target="_blank" rel="noopener" variant="sun" className="px-6 text-base">
            WhatsApp Moaviz
          </GelButton>
        </div>
      </Reveal>
    </section>
  )
}

export default function LandscapingPage() {
  return (
    <>
      <Hero />
      <Projects />
      <ConceptPlanner />
      <GrassFinder />
      <GrassCatalog />
      <Process />
      <Hire />
    </>
  )
}
