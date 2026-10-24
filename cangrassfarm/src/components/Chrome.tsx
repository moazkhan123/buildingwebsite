import { AnimatePresence, motion } from "motion/react"
import { Flower2, MapPin, Navigation, Minus, Phone, Plus, ShoppingBasket, Sprout, Trash2, X } from "lucide-react"
import { useEffect, useRef } from "react"
import type { Basket } from "@/lib/basket"
import { ADDRESS, ADDRESS_ONE_LINE, MAPS_URL, PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/lib/contact"
import { navigate, type Route } from "@/lib/router"
import { flowers } from "@/data/flowers"
import { cn } from "@/lib/cn"
import { GelButton, spring } from "./ui/gel"
import { GrassField } from "./Ambient"

const links: { to: Route; label: string; icon: typeof Flower2 }[] = [
  { to: "/", label: "Flowers", icon: Flower2 },
  { to: "/landscaping", label: "Landscaping", icon: Sprout },
]

export function Nav({ route, basket, onBasket }: { route: Route; basket: Basket; onBasket: () => void }) {
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
      <nav aria-label="Main" className="gel mx-auto flex max-w-6xl items-center gap-2 rounded-full py-1.5 pl-3 pr-1.5">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            navigate("/")
          }}
          className="mr-auto flex min-h-11 items-center gap-2 rounded-full pr-2"
        >
          <span className="gel-btn grid size-9 place-items-center rounded-full">
            <Sprout className="size-5" aria-hidden />
          </span>
          <span className="hidden font-serif text-base font-bold leading-tight sm:block">
            Canadian Grass Farm
            <span className="block font-sans text-[11px] font-semibold tracking-wide text-muted-foreground">& Flower Nursery</span>
          </span>
        </a>

        <ul className="flex items-center gap-1">
          {links.map((l) => {
            const active = route === l.to
            return (
              <li key={l.to}>
                <a
                  href={l.to}
                  aria-current={active ? "page" : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    navigate(l.to)
                  }}
                  className={cn(
                    "relative flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors duration-200 sm:px-4",
                    active ? "text-on-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && <motion.span layoutId="nav-pill" transition={spring} className="gel-btn absolute inset-0 rounded-full" />}
                  <l.icon className="relative size-4" aria-hidden />
                  <span className="relative">{l.label}</span>
                </a>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          onClick={onBasket}
          aria-label={`Order list, ${basket.count} plants`}
          className="relative grid size-11 cursor-pointer place-items-center rounded-full text-foreground transition-colors hover:bg-[var(--glass-tint)]"
        >
          <ShoppingBasket className="size-5" aria-hidden />
          <AnimatePresence>
            {basket.count > 0 && (
              <motion.span
                key={basket.count}
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={spring}
                className="gel-btn-sun gel-btn absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full px-1 text-[11px] font-bold"
              >
                {basket.count}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <GelButton href={PHONE_TEL} className="hidden md:inline-flex" aria-label={`Call Moaviz at ${PHONE_DISPLAY}`}>
          <Phone className="size-4" aria-hidden /> Call Moaviz
        </GelButton>
      </nav>
    </header>
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
            <p className="font-serif text-xl font-bold">Canadian Grass Farm & Flower Nursery</p>
            <p className="mt-1 text-sm opacity-90">Har rang, har mausam, phoolon ka sang.</p>
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
