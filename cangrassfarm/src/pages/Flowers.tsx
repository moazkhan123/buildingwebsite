import { AnimatePresence, LayoutGroup, motion, useScroll, useTransform } from "motion/react"
import {
  ArrowRight,
  Award,
  Coffee,
  Flower2,
  HeartPulse,
  House,
  Leaf,
  Phone,
  Pill,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  Sprout,
  Sun,
  SunDim,
  Trees,
  CloudSun,
  X,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { tagList, type Tag } from "@/data/flowers"
import { useContent, useT, type LocalFlower } from "@/i18n/content"
import { useHref } from "@/i18n/lang"
import type { Basket } from "@/lib/basket"
import { cn } from "@/lib/cn"
import { PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/lib/contact"
import { navigate } from "@/lib/router"
import { DewDrops, GrassField } from "@/components/Ambient"
import { HeroVideo } from "@/components/HeroVideo"
import { GelButton, Reveal, SectionHeading, spring } from "@/components/ui/gel"

const useIcon = { Tea: Coffee, Medicine: Pill, Kitchen: Leaf, "Home & Beauty": Sparkles, Garden: Sprout } as const
// Each use gets its own flower colour (deep shades so they read on the light background).
const tagColor: Record<Tag, string> = {
  Tea: "#0f766e",
  Medicinal: "#6d28d9",
  Edible: "#c2410c",
  Fragrant: "#be185d",
  Indoor: "#0369a1",
  Pollinators: "#a16207",
  Ornamental: "#be123c",
}

const heroFlowers = ["rose", "marigold", "orchid", "hibiscus", "lily", "tulip", "carnation", "pansy", "jasmine"]
const sunIcon = { "Full sun": Sun, "Part sun": CloudSun, Shade: SunDim } as const

function Hero() {
  const t = useT()
  const href = useHref()
  const { flowers } = useContent()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 80])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -4])
  return (
    <section ref={ref} className="relative isolate overflow-hidden pt-10 sm:pt-16" aria-labelledby="hero-title">
      <HeroVideo veil="left" />
      <DewDrops />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="mb-3 font-serif text-lg font-semibold italic text-primary sm:text-xl">{t.hero.slogan}</p>
          {/* No entrance fade on the headline, so it is visible in the prerendered HTML. */}
          <h1 id="hero-title" className="text-balance text-4xl font-bold sm:text-6xl">
            {t.hero.title1}{" "}
            <span className="bloom-text">{t.hero.title2}</span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-5 max-w-xl text-lg text-muted-foreground"
          >
            {t.hero.lead}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <GelButton href="#flowers" className="px-6 text-base">
              {t.hero.explore} <ArrowRight className="size-4" aria-hidden />
            </GelButton>
            <GelButton
              href={href("/landscaping")}
              variant="glass"
              className="px-6 text-base"
              onClick={(e) => {
                e.preventDefault()
                navigate("/landscaping")
              }}
            >
              <Trees className="size-4" aria-hidden /> {t.hero.landscaping}
            </GelButton>
          </motion.div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-3">
            {[
              ["31", t.hero.stats[0]],
              ["5", t.hero.stats[1]],
              ["12", t.hero.stats[2]],
            ].map(([n, l], i) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.08, ...spring }}
                className="gel rounded-2xl p-3 text-center"
              >
                <dt className="sr-only">{l}</dt>
                <dd className="font-serif text-2xl font-bold text-primary">{n}</dd>
                <dd className="text-xs font-semibold text-muted-foreground">{l}</dd>
              </motion.div>
            ))}
          </dl>
        </div>

        <motion.div style={{ y, rotate }} className="relative">
          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
            className="gel grid grid-cols-3 gap-2 rounded-[2rem] p-2 pb-6 sm:gap-3 sm:p-3 sm:pb-9"
            aria-label={t.hero.collageAria}
          >
            {heroFlowers.map((slug, i) => {
              const f = flowers.find((x) => x.slug === slug)!
              return (
                <motion.li
                  key={slug}
                  variants={{ hidden: { opacity: 0, scale: 0.8, y: 20 }, show: { opacity: 1, scale: 1, y: 0 } }}
                  transition={spring}
                  className={cn(i % 3 === 1 && "translate-y-4 sm:translate-y-6")}
                >
                  <figure className="relative overflow-hidden rounded-[1.4rem]">
                    <img src={`/img/flowers/${slug}.webp`} alt={f.name} width={240} height={240} className="aspect-square w-full object-cover" />
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/35 to-transparent" aria-hidden />
                    <figcaption className="gel absolute bottom-1.5 left-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold">{f.name}</figcaption>
                  </figure>
                </motion.li>
              )
            })}
          </motion.ul>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, ...spring }}
            className="gel absolute -bottom-12 right-4 flex items-center gap-3 rounded-2xl px-4 py-3"
          >
            <span className="gel-btn grid size-10 place-items-center rounded-full">
              <Phone className="size-5" aria-hidden />
            </span>
            <span className="text-sm">
              <span className="block font-bold">{t.hero.orderByPhone}</span>
              <a href={PHONE_TEL} className="text-muted-foreground underline-offset-2 hover:underline">
                {t.moaviz} · <span dir="ltr">{PHONE_DISPLAY}</span>
              </a>
            </span>
          </motion.div>
        </motion.div>
      </div>
      <GrassField className="mt-16" height={90} />
    </section>
  )
}

function FlowerCard({ f, onOpen, onAdd }: { f: LocalFlower; onOpen: () => void; onAdd: () => void }) {
  const t = useT()
  const SunIcon = sunIcon[f.sun]
  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      transition={spring}
      className="group"
    >
      <motion.div whileHover={{ y: -6 }} transition={spring} className="gel flex h-full flex-col overflow-hidden rounded-[1.75rem] p-2">
        <button type="button" onClick={onOpen} className="cursor-pointer text-left" aria-label={t.card.learnAbout(f.name)}>
          <motion.div layoutId={`img-${f.slug}`} className="relative overflow-hidden rounded-[1.4rem]">
            <img
              src={`/img/flowers/${f.slug}.webp`}
              alt={f.name}
              width={240}
              height={240}
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/35 to-transparent" aria-hidden />
            <span className="gel absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold">
              <SunIcon className="size-3.5 text-accent" aria-hidden /> {t.sun[f.sun]}
            </span>
          </motion.div>
          <div className="px-2 pb-1 pt-3">
            <h3 className="text-lg font-semibold">
              {f.name}
              {f.local && <span className="ml-1.5 font-sans text-xs font-semibold text-muted-foreground">{f.local}</span>}
            </h3>
            <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{f.tagline}</p>
          </div>
        </button>
        <div className="mt-auto flex flex-wrap gap-1 px-2 pb-2 pt-2">
          {f.tags.slice(0, 3).map((tg) => (
            <span key={tg} className="rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ color: tagColor[tg], background: `color-mix(in srgb, ${tagColor[tg]} 12%, transparent)` }}>
              {t.tags[tg]}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="m-1 mt-0 flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-border text-sm font-semibold transition-colors hover:bg-[var(--glass-tint)]"
        >
          <Plus className="size-4" aria-hidden /> {t.card.addToOrder}
        </button>
      </motion.div>
    </motion.li>
  )
}

function FlowerModal({ f, onClose, onAdd }: { f: LocalFlower; onClose: () => void; onAdd: () => void }) {
  const t = useT()
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])
  const SunIcon = sunIcon[f.sun]

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-6">
      <motion.div className="absolute inset-0 bg-black/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.article
        role="dialog"
        aria-modal="true"
        aria-labelledby="flower-title"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20, transition: { duration: 0.15 } }}
        transition={spring}
        className="gel relative grid max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-[2rem] p-3 sm:grid-cols-[2fr_3fr] sm:p-4"
        style={{ background: "color-mix(in srgb, var(--background) 92%, transparent)" }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t.modal.close}
          className="gel absolute right-4 top-4 z-10 grid size-11 cursor-pointer place-items-center rounded-full"
        >
          <X className="size-5" aria-hidden />
        </button>
        <motion.div layoutId={`img-${f.slug}`} className="overflow-hidden rounded-[1.5rem] sm:self-start">
          <img src={`/img/flowers/${f.slug}.webp`} alt={f.name} width={240} height={240} className="aspect-square w-full object-cover" />
        </motion.div>
        <div className="p-3 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{t.bloomer[f.season]}</p>
          <h2 id="flower-title" className="mt-1 text-3xl font-semibold">
            {f.name}
          </h2>
          {f.local && <p className="text-sm font-semibold text-muted-foreground">{f.local}</p>}
          <p className="mt-2 font-serif italic text-muted-foreground">{f.tagline}</p>

          <h3 className="mt-5 flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-wider">
            <HeartPulse className="size-4 text-primary" aria-hidden /> {t.modal.benefits}
          </h3>
          <ul className="mt-2 space-y-1.5 text-sm">
            {f.benefits.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary-2" aria-hidden />
                {b}
              </li>
            ))}
          </ul>

          <h3 className="mt-5 font-sans text-sm font-bold uppercase tracking-wider">{t.modal.howUsed}</h3>
          <ul className="mt-2 space-y-2">
            {f.uses.map((u) => {
              const Icon = useIcon[u.kind]
              return (
                <li key={u.text} className="flex gap-3 rounded-2xl bg-[var(--glass-tint)] p-3 text-sm">
                  <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <span>
                    <span className="font-bold">{t.useKind[u.kind]}: </span>
                    {u.text}
                  </span>
                </li>
              )
            })}
          </ul>

          <p className="mt-4 flex gap-2 text-sm">
            <SunIcon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
            <span>
              <span className="font-bold">{t.modal.care}: </span>
              {f.care}
            </span>
          </p>
          {f.caution && (
            <p role="note" className="mt-3 flex gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
              <span>
                <span className="font-bold">{t.modal.caution}: </span>
                {f.caution}
              </span>
            </p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            {t.modal.disclaimer}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <GelButton
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onAdd()
              }}
            >
              <Plus className="size-4" aria-hidden /> {t.card.addToOrder}
            </GelButton>
            <GelButton href={whatsappLink(t.modal.askMsg(f.name))} target="_blank" rel="noopener" variant="glass">
              {t.modal.askWhatsApp}
            </GelButton>
          </div>
        </div>
      </motion.article>
    </div>
  )
}

function FlowerExplorer({ basket }: { basket: Basket }) {
  const t = useT()
  const { flowers } = useContent()
  const [tag, setTag] = useState<Tag | "All">("All")
  const [q, setQ] = useState("")
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  // Look the open flower up by slug so it re-renders in the new language if the visitor switches.
  const open = flowers.find((f) => f.slug === openSlug) ?? null
  const [toast, setToast] = useState<string | null>(null)

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase()
    return flowers.filter(
      (f) =>
        (tag === "All" || f.tags.includes(tag)) &&
        (!s || f.search.includes(s)),
    )
  }, [flowers, tag, q])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(id)
  }, [toast])

  const add = (f: LocalFlower) => {
    basket.add(f.slug)
    setToast(t.explorer.added(f.name))
  }

  return (
    <section id="flowers" className="scroll-mt-24 px-4 pt-20 sm:px-6" aria-labelledby="flowers-title">
      <SectionHeading eyebrow={t.explorer.eyebrow} title={t.explorer.title} id="flowers-title">
        {t.explorer.intro}
      </SectionHeading>

      <div className="mx-auto mb-8 flex max-w-6xl flex-col gap-3 lg:flex-row lg:items-center">
        <label className="gel flex min-h-12 flex-1 items-center gap-2 rounded-full px-4 lg:max-w-xs">
          <Search className="size-4 text-muted-foreground" aria-hidden />
          <span className="sr-only">{t.explorer.searchLabel}</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.explorer.searchPlaceholder}
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
        </label>
        <LayoutGroup id="tags">
          <div role="radiogroup" aria-label={t.explorer.filterAria} className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
            {(["All", ...tagList] as const).map((tg) => {
              const active = tag === tg
              return (
                <button
                  key={tg}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setTag(tg)}
                  className={cn(
                    "relative min-h-11 shrink-0 cursor-pointer rounded-full px-4 text-sm font-semibold transition-colors duration-200",
                    active ? "text-on-primary" : "gel text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && <motion.span layoutId="tag-pill" transition={spring} className="gel-btn absolute inset-0 rounded-full" />}
                  <span className="relative">{tg === "All" ? t.all : t.tags[tg]}</span>
                </button>
              )
            })}
          </div>
        </LayoutGroup>
      </div>

      <LayoutGroup id="flowers">
        <motion.ul layout className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {shown.map((f) => (
              <FlowerCard key={f.slug} f={f} onOpen={() => setOpenSlug(f.slug)} onAdd={() => add(f)} />
            ))}
            {shown.length === flowers.length && (
              <motion.li key="ask" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <a
                  href={whatsappLink(t.explorer.elseMsg)}
                  target="_blank"
                  rel="noopener"
                  className="gel-btn flex h-full min-h-60 flex-col justify-end rounded-[1.75rem] p-5"
                >
                  <Sprout className="mb-auto size-8" aria-hidden />
                  <span className="font-serif text-xl font-semibold">{t.explorer.elseTitle}</span>
                  <span className="mt-1 text-sm opacity-90">{t.explorer.elseText}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold">
                    {t.explorer.askNow} <ArrowRight className="size-4" aria-hidden />
                  </span>
                </a>
              </motion.li>
            )}
          </AnimatePresence>
        </motion.ul>
        {shown.length === 0 && (
          <p className="mx-auto max-w-md py-12 text-center text-muted-foreground">
            {t.explorer.noMatch(q)}{" "}
            <button
              type="button"
              className="cursor-pointer font-semibold text-primary underline"
              onClick={() => {
                setQ("")
                setTag("All")
              }}
            >
              {t.explorer.showAll}
            </button>
          </p>
        )}
        {typeof document !== "undefined" && createPortal(<AnimatePresence>{open && <FlowerModal f={open} onClose={() => setOpenSlug(null)} onAdd={() => add(open)} />}</AnimatePresence>, document.body)}
      </LayoutGroup>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 md:bottom-6">
        <AnimatePresence>
          {toast && (
            <motion.p
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={spring}
              className="gel-btn rounded-full px-5 py-3 text-sm font-semibold"
            >
              {toast}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

const featureIcons = [Flower2, House, Award, Sparkles, HeartPulse]

function Features() {
  const t = useT()
  const features = t.features.items.map(([title, text], i) => ({ icon: featureIcons[i], title, text }))
  return (
    <section className="px-4 pt-24 sm:px-6" aria-labelledby="why-title">
      <SectionHeading eyebrow={t.features.eyebrow} title={t.features.title} id="why-title" />
      <ul className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {features.map((f, i) => (
          <motion.li
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="gel h-full rounded-[1.75rem] p-5"
          >
            <span className="gel-btn grid size-11 place-items-center rounded-2xl">
              <f.icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

function CallToAction() {
  const t = useT()
  const href = useHref()
  return (
    <section className="px-4 pt-24 sm:px-6">
      <Reveal className="gel relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] px-6 py-12 text-center sm:px-12">
        <DewDrops count={10} />
        <h2 className="text-balance text-3xl font-semibold sm:text-4xl">{t.cta.title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          {t.cta.text}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <GelButton
            href={href("/landscaping")}
            onClick={(e) => {
              e.preventDefault()
              navigate("/landscaping")
            }}
            className="px-6 text-base"
          >
            {t.cta.seeLandscaping} <ArrowRight className="size-4" aria-hidden />
          </GelButton>
          <GelButton href={PHONE_TEL} variant="sun" className="px-6 text-base">
            <Phone className="size-4" aria-hidden /> {t.call}
          </GelButton>
        </div>
      </Reveal>
    </section>
  )
}

export default function FlowersPage({ basket }: { basket: Basket }) {
  return (
    <>
      <Hero />
      <FlowerExplorer basket={basket} />
      <Features />
      <CallToAction />
    </>
  )
}
