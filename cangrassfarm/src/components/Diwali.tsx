import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Sparkles, Sprout, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useT } from "@/i18n/content"
import { navigate } from "@/lib/router"
import { spring } from "./ui/gel"

// Diwali greeting: fireworks burst over the page on the first visit of a session, and a card
// wishes visitors Happy Diwali and asks them to plant a tree. Shown until the end of
// Bhai Dooj, 11 November 2026 (India time), the last day of Diwali; closing the card hides it for good on that browser.
const UNTIL = Date.parse("2026-11-12T00:00:00+05:30")
const CLOSED = "cgf-diwali-2026-closed"
const PLAYED = "cgf-diwali-2026-played"
const COLORS = ["#ffd36b", "#ffb347", "#ff7a45", "#ff4d6d", "#f472b6", "#a3e635", "#fff3c4"]

const read = (s: Storage | undefined, k: string) => {
  try {
    return s?.getItem(k)
  } catch {
    return null
  }
}
const write = (s: Storage | undefined, k: string) => {
  try {
    s?.setItem(k, "1")
  } catch {
    // Storage blocked (private mode): the greeting simply shows again next time.
  }
}

type Spark = { x: number; y: number; vx: number; vy: number; life: number; decay: number; color: string; size: number; glitter: boolean }
type Rocket = { x: number; y: number; vy: number; peak: number; color: string }

/** Launches rockets for `seconds`, lets the last bursts fade, then calls onDone. */
function fireworks(canvas: HTMLCanvasElement, seconds: number, onDone: () => void) {
  const ctx = canvas.getContext("2d")!
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  let w = 0
  let h = 0
  const size = () => {
    w = canvas.clientWidth
    h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  size()
  window.addEventListener("resize", size)

  const rockets: Rocket[] = []
  const sparks: Spark[] = []
  const pick = () => COLORS[Math.floor(Math.random() * COLORS.length)]
  const scale = Math.max(0.7, Math.min(1.3, w / 900))
  const launch = () =>
    rockets.push({ x: w * (0.12 + Math.random() * 0.76), y: h + 10, vy: -(h / 70) * (0.9 + Math.random() * 0.25), peak: h * (0.12 + Math.random() * 0.33), color: pick() })
  const burst = (r: Rocket) => {
    const n = 70 + Math.floor(Math.random() * 50)
    const second = Math.random() < 0.45 ? pick() : r.color
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.2
      const v = (2.2 + Math.random() * 3.6) * scale
      sparks.push({ x: r.x, y: r.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, decay: 0.009 + Math.random() * 0.012, color: i % 3 ? r.color : second, size: 1.6 + Math.random() * 1.8, glitter: Math.random() < 0.3 })
    }
  }

  const start = performance.now()
  let last = start
  let next = start
  let frame = 0
  const tick = (now: number) => {
    const dt = Math.min(3, (now - last) / 16.7)
    last = now
    const launching = now - start < seconds * 1000
    if (launching && now >= next) {
      launch()
      if (Math.random() < 0.35) launch()
      next = now + 260 + Math.random() * 420
    }

    // Fade the previous frame so sparks leave short trails on the transparent canvas.
    ctx.globalCompositeOperation = "destination-out"
    ctx.fillStyle = `rgba(0,0,0,${0.28 * dt})`
    ctx.fillRect(0, 0, w, h)
    ctx.globalCompositeOperation = "lighter"

    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i]
      r.y += r.vy * dt
      r.vy *= Math.pow(0.985, dt)
      ctx.fillStyle = "#fff3c4"
      ctx.beginPath()
      ctx.arc(r.x + (Math.random() - 0.5), r.y, 2.4, 0, Math.PI * 2)
      ctx.fill()
      if (r.y <= r.peak || r.vy > -1.5) {
        burst(r)
        rockets.splice(i, 1)
      }
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]
      s.vx *= Math.pow(0.975, dt)
      s.vy = s.vy * Math.pow(0.975, dt) + 0.045 * dt
      s.x += s.vx * dt
      s.y += s.vy * dt
      s.life -= s.decay * dt
      if (s.life <= 0) {
        sparks.splice(i, 1)
        continue
      }
      ctx.globalAlpha = s.glitter ? s.life * (0.4 + Math.random() * 0.6) : s.life
      ctx.fillStyle = s.color
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.size * (0.5 + s.life * 0.5), 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1

    if (launching || rockets.length || sparks.length) frame = requestAnimationFrame(tick)
    else onDone()
  }
  frame = requestAnimationFrame(tick)
  return () => {
    cancelAnimationFrame(frame)
    window.removeEventListener("resize", size)
  }
}

export function DiwaliGreeting() {
  const t = useT().diwali
  const reduce = useReducedMotion()
  const [card, setCard] = useState(false)
  const [show, setShow] = useState(0)

  // Decide in the browser only, so prerendered pages never carry the seasonal greeting.
  useEffect(() => {
    if (Date.now() >= UNTIL || read(localStorage, CLOSED)) return
    setCard(true)
    if (!reduce && !read(sessionStorage, PLAYED)) {
      write(sessionStorage, PLAYED)
      setShow(1)
    }
    // Run once on load; a later change to the motion setting shouldn't replay the show.
  }, [])

  const close = () => {
    write(localStorage, CLOSED)
    setCard(false)
  }

  return (
    <>
      {show > 0 && <Show key={show} onDone={() => setShow(0)} />}
      <AnimatePresence>
        {card && (
          <motion.aside
            aria-label={t.label}
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ delay: 1.2, ...spring }}
            className="fixed bottom-4 left-3 right-20 z-50 overflow-hidden rounded-[1.75rem] p-4 text-[#fff7e6] sm:left-4 sm:right-auto sm:w-[23rem] sm:p-5"
            style={{
              marginBottom: "env(safe-area-inset-bottom)",
              background: "radial-gradient(120% 90% at 50% 0%, #7a1c2c, #4a0d1c 60%, #2a0714)",
              boxShadow: "0 18px 40px -14px rgba(42,7,20,.7), inset 3px 3px 8px rgba(255,190,140,.25), inset -4px -6px 12px rgba(0,0,0,.35)",
            }}
          >
            <button
              type="button"
              onClick={close}
              aria-label={t.close}
              className="absolute right-2.5 top-2.5 grid size-9 cursor-pointer place-items-center rounded-full text-[#ffd9a0] transition-colors hover:bg-white/10"
            >
              <X className="size-4" aria-hidden />
            </button>
            <p className="pr-8 font-serif text-2xl font-bold leading-tight sm:text-[1.7rem]">
              <span aria-hidden className="mr-1.5">🪔</span>
              <span className="bg-gradient-to-b from-[#fff3c4] via-[#ffd36b] to-[#f59e0b] bg-clip-text text-transparent">{t.hello}</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#ffe2c2]">{t.text}</p>
            <p className="mt-2 text-sm font-bold text-[#bef264]">{t.pledge}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate("/#flowers")}
                className="gel-btn inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full px-4 text-sm font-semibold"
              >
                <Sprout className="size-4" aria-hidden />
                {t.plants}
              </button>
              <button
                type="button"
                onClick={() => setShow((n) => n + 1)}
                className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border border-[#ffcf5a]/50 px-4 text-sm font-semibold text-[#ffe2a8] transition-colors hover:bg-white/10"
              >
                <Sparkles className="size-4" aria-hidden />
                {t.again}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

/** A few seconds of fireworks over a dimmed night sky; clicks pass through to the page. */
function Show({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [fading, setFading] = useState(false)
  const done = useCallback(() => setFading(true), [])
  useEffect(() => fireworks(ref.current!, 5.5, done), [done])
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[45]"
      initial={{ opacity: 0 }}
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: fading ? 0.8 : 0.5 }}
      onAnimationComplete={() => fading && onDone()}
      style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(42,7,20,.55), rgba(20,4,12,.75))" }}
    >
      <canvas ref={ref} className="size-full" />
    </motion.div>
  )
}
