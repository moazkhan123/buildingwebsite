import { AnimatePresence, motion } from "motion/react"
import { Check, CloudSun, Droplets, Footprints, Layers, Phone, Ruler, Shovel, Snowflake, Sprout, Sun, SunDim, Thermometer, Trees, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import {
  conceptFor,
  recommendGrass,
  type Concept,
  type Grass,
  type SiteAnswers,
  type Space,
  type Sun as SunLevel,
} from "@/data/landscaping"
import { cn } from "@/lib/cn"
import { PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/lib/contact"
import { DewDrops, GrassField } from "@/components/Ambient"
import { ParallaxHero } from "@/components/ui/parallax-hero"
import { GelButton, GelSegment, Reveal, SectionHeading, spring } from "@/components/ui/gel"
import { useContent, useT } from "@/i18n/content"

const sunIcons = { full: Sun, partial: CloudSun, shade: SunDim } as const

function Hero() {
  const t = useT()
  return (
    <section className="relative isolate -mt-24 overflow-hidden sm:-mt-28" aria-labelledby="land-title">
      <ParallaxHero contentTop="calc(40% + 30px)" fadeBottom>
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="gel mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary"
          >
            <Trees className="size-4" aria-hidden /> {t.landHero.badge}
          </motion.p>
          <h1 id="land-title" className="text-balance text-4xl font-bold sm:text-6xl">
            {t.landHero.title1}{" "}
            <span className="bloom-text">{t.landHero.title2}</span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground"
          >
            {t.landHero.lead}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <GelButton href={PHONE_TEL} className="px-6 text-base">
              <Phone className="size-4" aria-hidden /> {t.landHero.hire} · <span dir="ltr">{PHONE_DISPLAY}</span>
            </GelButton>
            <GelButton href="#grass-finder" variant="glass" className="px-6 text-base">
              <Sprout className="size-4" aria-hidden /> {t.landHero.findGrass}
            </GelButton>
          </motion.div>
        </div>
      </ParallaxHero>
    </section>
  )
}

function Projects() {
  const t = useT()
  const { projects } = useContent()
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
  }, [open, projects.length])

  return (
    <section id="projects" className="scroll-mt-24 px-4 pt-20 sm:px-6" aria-labelledby="projects-title">
      <SectionHeading eyebrow={t.projects.eyebrow} title={t.projects.title} id="projects-title">
        {t.projects.intro}
      </SectionHeading>
      <ul className="mx-auto grid max-w-6xl auto-rows-[220px] grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {projects.map((p, i) => (
          <motion.li
            key={p.img}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className={cn(i === 0 && "col-span-2 row-span-2")}
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={t.projects.view(p.title)}
              className="gel group relative block h-full w-full cursor-pointer overflow-hidden rounded-[1.75rem] p-1.5"
            >
              <motion.img
                layoutId={`project-${i}`}
                src={p.img}
                alt={`${p.title} (${p.kind})`}
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
      {typeof document !== "undefined" && createPortal(
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
                  {projects[open].grass !== "—" && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      {t.projects.grass}: {projects[open].grass}
                    </span>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">{t.projects.browseHint}</span>
              </figcaption>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(null)}
                aria-label={t.modal.close}
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
  const t = useT()
  const { spaces, exposure, concepts, grasses } = useContent()
  const [space, setSpace] = useState<Space>("front-yard")
  const [sun, setSun] = useState<SunLevel>("full")
  const [pickedId, setPickedId] = useState<string | null>(null)
  const s = spaces.find((x) => x.id === space)!
  const e = exposure[sun]
  // A concept tapped in the gallery wins until the visitor changes space or sun.
  const picked = concepts.find((x) => x.id === pickedId)
  const c = picked && picked.space === space && picked.sun === sun ? picked : concepts.find((x) => x.id === conceptFor[space][sun])!
  const g = grasses.find((x) => x.id === (c.grass ?? "all-season"))!
  const SunIcon = sunIcons[sun]

  const pick = (x: Concept) => {
    setPickedId(x.id)
    setSpace(x.space)
    setSun(x.sun)
    document.getElementById("concept-result")?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  return (
    <section id="concepts" className="scroll-mt-24 px-4 pt-24 sm:px-6" aria-labelledby="concepts-title">
      <SectionHeading eyebrow={t.planner.eyebrow} title={t.planner.title} id="concepts-title">
        {t.planner.intro}
      </SectionHeading>
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Reveal className="space-y-5">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-bold">
              <Ruler className="size-4 text-primary" aria-hidden /> {t.planner.yourSpace}
            </p>
            <div role="radiogroup" aria-label={t.planner.yourSpace} className="grid grid-cols-2 gap-2">
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
              <Sun className="size-4 text-accent" aria-hidden /> {t.planner.sunExposure}
            </p>
            <GelSegment
              name="sun"
              label={t.planner.sunExposure}
              value={sun}
              onChange={setSun}
              options={[
                { id: "full", label: t.planner.sunOptions.full },
                { id: "partial", label: t.planner.sunOptions.partial },
                { id: "shade", label: t.planner.sunOptions.shade },
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
            <h3 className="mt-2 text-2xl font-semibold">{t.planner.conceptFor(s.label)}</h3>
            <ul className="mt-4 space-y-2">
              {s.ideas.map((idea) => (
                <li key={idea} className="flex gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /> {idea}
                </li>
              ))}
            </ul>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[var(--glass-tint)] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.planner.suggestedLawn}</p>
                <p className="mt-1 flex items-center gap-2 font-serif text-lg font-semibold">
                  <span className="size-3 rounded-full" style={{ background: g.hue }} aria-hidden /> {g.name}
                </p>
                <p className="text-sm text-muted-foreground">{g.tagline}</p>
              </div>
              <div className="rounded-2xl bg-[var(--glass-tint)] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.planner.plantsThrive}</p>
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

function ConceptGallery({ onPick }: { onPick: (c: Concept) => void }) {
  const t = useT()
  const { spaces, exposure, concepts, grassName } = useContent()
  const spaceLabel = Object.fromEntries(spaces.map((x) => [x.id, x.label])) as Record<Space, string>
  const [filter, setFilter] = useState<SunLevel | "all">("all")
  const [expanded, setExpanded] = useState(false)
  const matching = concepts.filter((c) => filter === "all" || c.sun === filter)
  const shown = expanded || filter !== "all" ? matching : matching.slice(0, 9)

  return (
    <div className="mx-auto mt-16 max-w-6xl">
      <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div>
          <h3 className="text-2xl font-semibold">{t.gallery.title}</h3>
          <p className="text-sm text-muted-foreground">{t.gallery.intro}</p>
        </div>
        <div className="w-full sm:w-auto sm:min-w-96">
          <GelSegment
            name="gallery-sun"
            label={t.gallery.filterAria}
            value={filter}
            onChange={setFilter}
            options={[
              { id: "all", label: t.all },
              { id: "full", label: t.planner.sunOptions.full },
              { id: "partial", label: t.planner.sunOptions.partial },
              { id: "shade", label: t.planner.sunOptions.shade },
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
                  aria-label={t.gallery.load(c.title)}
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
                      <span className="rounded-full bg-[var(--glass-tint)] px-2.5 py-1">{c.grass ? grassName(c.grass) : t.gallery.noLawn}</span>
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
            {expanded ? t.gallery.showFewer : t.gallery.showAll(matching.length)}
          </GelButton>
        </div>
      )}
    </div>
  )
}

const questions: { key: keyof SiteAnswers; icon: typeof Sun }[] = [
  { key: "sun", icon: Sun },
  { key: "soil", icon: Layers },
  { key: "use", icon: Footprints },
  { key: "water", icon: Droplets },
  { key: "need", icon: Thermometer },
]

function GrassFinder() {
  const t = useT()
  const { grasses } = useContent()
  const grassById = (id: string) => grasses.find((g) => g.id === id)!
  const [a, setA] = useState<SiteAnswers>({ sun: "full", soil: "loamy", use: "family", water: "plenty", need: "year-round" })
  const ranked = useMemo(() => recommendGrass(a), [a])
  const best = grassById(ranked[0].id)
  const runnerUp = grassById(ranked[1].id)
  const q = t.finder.questions
  const optionLabel = (k: keyof SiteAnswers) => (q[k].options as Record<string, string>)[a[k]]
  const answers = questions.map(({ key }) => `${q[key].short}: ${optionLabel(key)}`).join(", ")
  const max = Math.max(...ranked.map((r) => r.score), 1)

  return (
    <section id="grass-finder" className="scroll-mt-24 px-4 pt-24 sm:px-6" aria-labelledby="finder-title">
      <SectionHeading eyebrow={t.finder.eyebrow} title={t.finder.title} id="finder-title">
        {t.finder.intro}
      </SectionHeading>
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Reveal className="gel space-y-5 rounded-[2rem] p-5 sm:p-7">
          {questions.map(({ key, icon: Icon }) => (
            <div key={key}>
              <p className="mb-2 flex items-center gap-2 text-sm font-bold">
                <Icon className="size-4 text-primary" aria-hidden /> {q[key].label}
              </p>
              <GelSegment
                name={key}
                label={q[key].label}
                value={a[key]}
                onChange={(v) => setA((p) => ({ ...p, [key]: v }))}
                options={Object.entries(q[key].options).map(([id, label]) => ({ id, label }))}
              />
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
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{t.finder.bestMatch}</p>
              <h3 className="mt-1 text-3xl font-semibold">{best.name}</h3>
              <p className="text-muted-foreground">{best.tagline}</p>
              <ul className="mt-4 space-y-1.5">
                {ranked[0].reasons.map((r) => (
                  <li key={r} className="flex gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /> {t.reasons[r]}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm">
                <span className="font-semibold">{t.finder.alsoConsider}</span> {runnerUp.name}
              </p>
              <GelButton
                href={whatsappLink(t.finder.quoteMsg(best.name, answers))}
                target="_blank"
                rel="noopener"
                className="mt-5 w-full"
              >
                {t.finder.quote(best.name)}
              </GelButton>
            </motion.div>
          </AnimatePresence>

          <div className="gel rounded-[2rem] p-5">
            <p className="mb-3 text-sm font-bold">{t.finder.scores}</p>
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
  const t = useT()
  const rows = [
    { icon: Sun, label: t.grassRows.sun, v: g.sun },
    { icon: Layers, label: t.grassRows.soil, v: g.soil },
    { icon: Droplets, label: t.grassRows.water, v: g.water },
    { icon: Footprints, label: t.grassRows.traffic, v: g.traffic },
    { icon: g.id === "winter" ? Snowflake : Thermometer, label: t.grassRows.season, v: g.season },
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
  const t = useT()
  const { grasses } = useContent()
  return (
    <section id="grasses" className="scroll-mt-24 px-4 pt-24 sm:px-6" aria-labelledby="grasses-title">
      <SectionHeading eyebrow={t.catalog.eyebrow} title={t.catalog.title} id="grasses-title">
        {t.catalog.intro}
      </SectionHeading>
      <ul className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {grasses.map((g, i) => (
          <GrassCard key={g.id} g={g} i={i} className={i < 3 ? "lg:col-span-2" : "lg:col-span-3"} />
        ))}
      </ul>
    </section>
  )
}

const stepIcons = [Phone, Ruler, Layers, Shovel]

function Process() {
  const t = useT()
  const steps = t.process.steps.map(([title, text], i) => ({ icon: stepIcons[i], title, text }))
  return (
    <section className="px-4 pt-24 sm:px-6" aria-labelledby="process-title">
      <SectionHeading eyebrow={t.process.eyebrow} title={t.process.title} id="process-title" />
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
  const t = useT()
  return (
    <section className="px-4 pt-24 sm:px-6">
      <Reveal className="gel relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] px-6 py-12 text-center sm:px-12">
        <DewDrops count={10} />
        <h2 className="text-balance text-3xl font-semibold sm:text-4xl">{t.hire.title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          {t.hire.text}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <GelButton href={PHONE_TEL} className="px-6 text-base">
            <Phone className="size-4" aria-hidden /> <span dir="ltr">{PHONE_DISPLAY}</span>
          </GelButton>
          <GelButton href={whatsappLink(t.hire.msg)} target="_blank" rel="noopener" variant="sun" className="px-6 text-base">
            {t.hire.whatsapp}
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
