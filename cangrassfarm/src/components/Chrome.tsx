import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react"
import { ChevronDown, Flower2, MapPin, Menu as MenuIcon, Navigation, Minus, Phone, Plus, ShoppingBasket, Sprout, Trash2, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { Basket } from "@/lib/basket"
import { ADDRESS, ADDRESS_ONE_LINE, MAPS_URL, PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/lib/contact"
import { navigate, type Route } from "@/lib/router"
import { flowers } from "@/data/flowers"
import { cn } from "@/lib/cn"
import { GelButton, spring } from "./ui/gel"
import { GrassField } from "./Ambient"
import { LogoMark, Wordmark } from "./Logo"

const links: { to: Route; label: string; hint: string; icon: typeof Flower2 }[] = [
  { to: "/", label: "Flowers", hint: "31 flowers and what they're good for", icon: Flower2 },
  { to: "/landscaping", label: "Landscaping", hint: "Lawns, design concepts, grass finder", icon: Sprout },
]

export function Nav({ route, basket, onBasket }: { route: Route; basket: Basket; onBasket: () => void }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  // Hide the bar while scrolling down so it never sits over the content; bring it
  // back on any upward scroll, near the top, or while the menu is open.
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 8)
    if (y < 70 || y < prev - 4) setHidden(false)
    else if (y > prev) setHidden(true)
  })

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("pointerdown", onDown)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("pointerdown", onDown)
    }
  }, [open])

  return (
    <motion.header
      className="sticky top-0 z-40 px-3 pt-3 sm:px-6"
      animate={{ y: hidden && !open ? "-130%" : "0%" }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onFocusCapture={() => setHidden(false)}
    >
      <nav
        aria-label="Main"
        className="gel mx-auto flex max-w-6xl items-center gap-1 rounded-full py-1.5 pl-2 pr-1.5 transition-[background-color] duration-300 sm:gap-2 sm:py-2 sm:pl-3 sm:pr-2"
        style={scrolled ? { background: "color-mix(in srgb, var(--background) 96%, transparent)" } : undefined}
      >
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            navigate("/")
          }}
          aria-label="Canadian Grass Farm, home"
          className="logo-hover mr-auto flex min-h-11 min-w-0 items-center gap-2 rounded-full pr-1 sm:gap-3 sm:pr-2"
        >
          <LogoMark className="size-10 shrink-0 drop-shadow-md sm:size-14" />
          <motion.span
            initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="cgf-title whitespace-nowrap font-serif text-[clamp(0.95rem,5.2vw,1.6rem)] font-bold leading-none tracking-tight sm:text-[2rem] lg:text-[2.4rem]"
          >
            Canadian Grass Farm
          </motion.span>
        </a>

        <div ref={wrapRef} className="relative">
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={basket.count > 0 ? `Menu, ${basket.count} plants in your order` : "Menu"}
            onClick={() => setOpen((o) => !o)}
            className="gel-btn relative flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 text-sm font-semibold sm:px-5"
          >
            <MenuIcon className="size-5" aria-hidden />
            <span className="hidden sm:inline">Menu</span>
            <ChevronDown className={cn("hidden size-4 transition-transform duration-200 sm:block", open && "rotate-180")} aria-hidden />
          </button>
          {/* Outside the button: .gel-btn clips its overflow. */}
          <AnimatePresence>
            {basket.count > 0 && (
              <motion.span
                key={basket.count}
                aria-hidden
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={spring}
                className="gel-btn-sun gel-btn pointer-events-none absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full px-1 text-[11px] font-bold"
              >
                {basket.count}
              </motion.span>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {open && (
              <motion.div
                ref={panelRef}
                id="site-menu"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.12 } }}
                transition={spring}
                className="gel absolute right-0 top-full mt-3 w-[min(20rem,calc(100vw-1.5rem))] origin-top-right rounded-3xl p-2"
                style={{ background: "color-mix(in srgb, var(--background) 94%, transparent)" }}
              >
                <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Pages</p>
                <ul>
                  {links.map((l) => {
                    const active = route === l.to
                    return (
                      <li key={l.to}>
                        <a
                          href={l.to}
                          aria-current={active ? "page" : undefined}
                          onClick={(e) => {
                            e.preventDefault()
                            setOpen(false)
                            navigate(l.to)
                          }}
                          className={cn(
                            "flex min-h-14 items-center gap-3 rounded-2xl px-3 py-2 transition-colors duration-150 hover:bg-[var(--glass-tint)]",
                            active && "bg-[var(--glass-tint)]",
                          )}
                        >
                          <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", active ? "gel-btn" : "bg-[var(--glass-tint)] text-primary")}>
                            <l.icon className="size-5" aria-hidden />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold">{l.label}</span>
                            <span className="block text-xs text-muted-foreground">{l.hint}</span>
                          </span>
                          {active && <span className="size-2 shrink-0 rounded-full bg-primary" aria-hidden />}
                        </a>
                      </li>
                    )
                  })}
                </ul>
                <div className="my-2 h-px bg-border" />
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    onBasket()
                  }}
                  className="flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-2xl px-3 text-left font-semibold transition-colors hover:bg-[var(--glass-tint)]"
                >
                  <ShoppingBasket className="size-5 text-primary" aria-hidden />
                  <span className="flex-1">Your order list</span>
                  {basket.count > 0 && <span className="gel-btn-sun gel-btn rounded-full px-2 py-0.5 text-xs font-bold tabular-nums">{basket.count}</span>}
                </button>
                <GelButton href={PHONE_TEL} className="mt-2 w-full" aria-label={`Call Moaviz at ${PHONE_DISPLAY}`}>
                  <Phone className="size-4" aria-hidden /> Call Moaviz · {PHONE_DISPLAY}
                </GelButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </motion.header>
  )
}

export function FloatingCall() {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, ...spring }}
      className="fixed bottom-4 right-4 z-30 flex flex-col gap-2 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <GelButton href={PHONE_TEL} className="size-14 rounded-full p-0" aria-label={`Call Moaviz at ${PHONE_DISPLAY}`}>
        <Phone className="size-6" aria-hidden />
      </GelButton>
    </motion.div>
  )
}

export function BasketDrawer({ open, onClose, basket }: { open: boolean; onClose: () => void; basket: Basket }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  const entries = Object.entries(basket.items)
    .map(([slug, qty]) => ({ flower: flowers.find((f) => f.slug === slug), qty }))
    .filter((e) => e.flower)
  const message =
    "Hi Moaviz, I'd like to order these plants from Canadian Grass Farm:\n" +
    entries.map((e) => `• ${e.flower!.name} × ${e.qty}`).join("\n") +
    "\n\nPlease share price and availability."

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="basket-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%", transition: { duration: 0.2 } }}
            transition={spring}
            className="gel absolute inset-y-0 right-0 flex w-full max-w-md flex-col rounded-l-[2rem] p-6"
            style={{ background: "color-mix(in srgb, var(--background) 92%, transparent)" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="basket-title" className="text-2xl font-semibold">
                Your plant order
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close order list"
                className="grid size-11 cursor-pointer place-items-center rounded-full hover:bg-[var(--glass-tint)]"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            {entries.length === 0 ? (
              <div className="grid flex-1 place-items-center text-center text-muted-foreground">
                <div>
                  <ShoppingBasket className="mx-auto mb-3 size-10 text-primary" aria-hidden />
                  <p>Your list is empty.</p>
                  <p className="text-sm">Tap “Add to order” on any flower, then send the list to Moaviz on WhatsApp.</p>
                </div>
              </div>
            ) : (
              <ul className="-mx-2 flex-1 space-y-2 overflow-y-auto px-2">
                <AnimatePresence initial={false}>
                  {entries.map(({ flower, qty }) => (
                    <motion.li
                      key={flower!.slug}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="gel flex items-center gap-3 rounded-2xl p-2"
                    >
                      <img src={`/img/flowers/${flower!.slug}.webp`} alt="" width={48} height={48} className="size-12 rounded-xl object-cover" />
                      <span className="flex-1 font-semibold">{flower!.name}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label={`Remove one ${flower!.name}`}
                          onClick={() => basket.set(flower!.slug, qty - 1)}
                          className="grid size-11 cursor-pointer place-items-center rounded-full hover:bg-[var(--glass-tint)]"
                        >
                          {qty === 1 ? <Trash2 className="size-4" aria-hidden /> : <Minus className="size-4" aria-hidden />}
                        </button>
                        <span className="w-6 text-center font-bold tabular-nums" aria-live="polite">
                          {qty}
                        </span>
                        <button
                          type="button"
                          aria-label={`Add one ${flower!.name}`}
                          onClick={() => basket.set(flower!.slug, qty + 1)}
                          className="grid size-11 cursor-pointer place-items-center rounded-full hover:bg-[var(--glass-tint)]"
                        >
                          <Plus className="size-4" aria-hidden />
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}

            <div className="mt-4 space-y-2 border-t border-border pt-4">
              {entries.length > 0 && (
                <GelButton href={whatsappLink(message)} target="_blank" rel="noopener" className="w-full">
                  Send order on WhatsApp
                </GelButton>
              )}
              <GelButton href={PHONE_TEL} variant="glass" className="w-full">
                <Phone className="size-4" aria-hidden /> Call Moaviz · {PHONE_DISPLAY}
              </GelButton>
              {entries.length > 0 && (
                <button type="button" onClick={basket.clear} className="min-h-11 w-full cursor-pointer text-sm text-muted-foreground underline">
                  Clear list
                </button>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}

function VisitNursery() {
  return (
    <section id="visit" className="scroll-mt-24 px-4 sm:px-6" aria-labelledby="visit-title">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="gel mx-auto grid max-w-5xl items-center gap-6 rounded-[2.5rem] p-6 sm:p-10 md:grid-cols-[auto_1fr_auto]"
      >
        <span className="gel-btn grid size-16 place-items-center rounded-3xl">
          <MapPin className="size-8" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Visit our nursery</p>
          <h2 id="visit-title" className="mt-1 text-2xl font-semibold sm:text-3xl">
            Come see the plants in person
          </h2>
          <address className="mt-3 not-italic leading-relaxed text-muted-foreground">
            {ADDRESS.street}
            <br />
            {ADDRESS.area}, {ADDRESS.city}, {ADDRESS.region} {ADDRESS.postcode}
          </address>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Landmarks">
            {ADDRESS.landmarks.map((l) => (
              <li key={l} className="rounded-full bg-[var(--glass-tint)] px-3 py-1 text-sm font-semibold text-primary">
                {l}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <GelButton href={MAPS_URL} target="_blank" rel="noopener" className="px-6">
            <Navigation className="size-4" aria-hidden /> Get directions
          </GelButton>
          <GelButton href={PHONE_TEL} variant="glass" className="px-6">
            <Phone className="size-4" aria-hidden /> Call Moaviz
          </GelButton>
        </div>
      </motion.div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="relative mt-24">
      <VisitNursery />
      <GrassField height={70} density={180} className="mt-16" />
      <div className="-mt-px bg-gradient-to-b from-primary-2 to-primary px-6 pb-10 pt-8 text-on-primary">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
          <div>
            <div className="logo-hover flex items-center gap-3">
              <LogoMark className="size-16 drop-shadow-lg" />
              <Wordmark size="lg" plain />
            </div>
            <p className="mt-3 text-sm opacity-90">Har rang, har mausam, phoolon ka sang.</p>
          </div>
          <div className="text-sm">
            <p className="mb-1 font-bold uppercase tracking-wider opacity-80">Visit</p>
            <address className="flex gap-2 not-italic">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{ADDRESS_ONE_LINE}</span>
            </address>
            <a href={MAPS_URL} target="_blank" rel="noopener" className="mt-1 flex min-h-11 items-center gap-2 font-semibold underline-offset-4 hover:underline">
              <Navigation className="size-4" aria-hidden /> Get directions
            </a>
          </div>
          <div className="text-sm">
            <p className="mb-1 font-bold uppercase tracking-wider opacity-80">Orders & projects</p>
            <a href={PHONE_TEL} className="flex min-h-11 items-center gap-2 font-semibold underline-offset-4 hover:underline">
              <Phone className="size-4" aria-hidden /> Moaviz · {PHONE_DISPLAY}
            </a>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-6xl text-xs opacity-80">
          Green Living · Happy Life — © {new Date().getFullYear()} Canadian Grass Farm. Plant uses are traditional and for information only; consult a doctor before using any plant as medicine.
        </p>
      </div>
    </footer>
  )
}
