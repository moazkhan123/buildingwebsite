import { motion, useReducedMotion } from "motion/react"

// Flower colours shared by the backdrop, the lawn and the tag chips.
export const BLOOMS = ["#f472b6", "#fb923c", "#facc15", "#a78bfa", "#2dd4bf", "#f87171", "#60a5fa"]

// Decoration is drawn only in the browser: build-time prerendered pages skip it to stay small.
const isServer = typeof window === "undefined"

// Gooey morphing gel blobs in flower colours, plus a field of glowing
// flowers drifting behind the whole site.
export function GelBackdrop() {
  if (isServer) return null
  return <Backdrop />
}

function Backdrop() {
  const reduce = useReducedMotion()
  const blobs = [
    { c: "#2dd4bf", x: "8%", y: "12%", s: 420, o: 0.22 },
    { c: "#f472b6", x: "72%", y: "4%", s: 340, o: 0.2 },
    { c: "#a78bfa", x: "60%", y: "55%", s: 480, o: 0.18 },
    { c: "#fb923c", x: "-6%", y: "70%", s: 380, o: 0.16 },
    { c: "#facc15", x: "35%", y: "35%", s: 260, o: 0.1 },
  ]
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <svg className="absolute h-0 w-0">
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -12" />
        </filter>
      </svg>
      <div className="absolute inset-0" style={{ filter: "url(#goo) blur(30px)" }}>
        {blobs.map((b, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ left: b.x, top: b.y, width: b.s, height: b.s, background: b.c, opacity: b.o }}
            animate={
              reduce
                ? undefined
                : {
                    x: [0, 40, -30, 0],
                    y: [0, -30, 25, 0],
                    borderRadius: ["50% 50% 50% 50%", "60% 40% 55% 45%", "45% 55% 40% 60%", "50% 50% 50% 50%"],
                  }
            }
            transition={{ duration: 18 + i * 4, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
      <FlowerField />
    </div>
  )
}

function Bloom({ petals, color, size }: { petals: number; color: string; size: number }) {
  const rx = petals > 6 ? 3.2 : 5
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} style={{ filter: `drop-shadow(0 0 ${size / 6}px ${color})` }}>
      {Array.from({ length: petals }, (_, k) => (
        <ellipse key={k} cx="20" cy="10" rx={rx} ry="9" fill={color} opacity="0.9" transform={`rotate(${(360 / petals) * k} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="4.5" fill="#fde68a" />
    </svg>
  )
}

// Faint flowers scattered over the page; positions are fixed so they stay put between renders.
function FlowerField() {
  const flowers = Array.from({ length: 16 }, (_, i) => ({
    left: `${(i * 37 + rand(i + 40) * 20) % 100}%`,
    top: `${(i * 23 + rand(i + 41) * 30) % 100}%`,
    size: 34 + rand(i + 42) * 46,
    petals: [5, 6, 8, 12][i % 4],
    color: BLOOMS[i % BLOOMS.length],
    opacity: 0.16 + rand(i + 43) * 0.14,
    d: 24 + rand(i + 44) * 20,
    delay: -rand(i + 45) * 30,
  }))
  return (
    <div className="absolute inset-0">
      {flowers.map((f, i) => (
        <span
          key={i}
          className="bloom absolute"
          style={{ left: f.left, top: f.top, opacity: f.opacity, ["--d" as string]: `${f.d}s`, ["--delay" as string]: `${f.delay}s` }}
        >
          <Bloom petals={f.petals} color={f.color} size={f.size} />
        </span>
      ))}
    </div>
  )
}

// Deterministic pseudo-random so the lawn looks the same on every render.
function rand(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

export function GrassField({ height = 110, density = 140, className = "" }: { height?: number; density?: number; className?: string }) {
  const blades = Array.from({ length: density }, (_, i) => {
    const x = (i / density) * 1000 + rand(i) * 8
    const h = height * (0.45 + rand(i + 1) * 0.55)
    const w = 5 + rand(i + 2) * 6
    const lean = (rand(i + 3) - 0.5) * 26
    const fill = ["var(--blade-1)", "var(--blade-2)", "var(--blade-3)"][i % 3]
    const bloom = i % 9 === 4 ? BLOOMS[(i * 3) % BLOOMS.length] : null
    return { x, h, w, lean, fill, bloom, d: 3 + rand(i + 4) * 3, delay: -rand(i + 5) * 4 }
  })
  if (isServer) return <div aria-hidden className={`pointer-events-none relative ${className}`} style={{ height }} />
  return (
    <div aria-hidden className={`pointer-events-none relative ${className}`} style={{ height }}>
    <svg
      viewBox={`0 0 1000 ${height}`}
      preserveAspectRatio="none"
      className="block h-full w-full"
    >
      <defs>
        <linearGradient id="bladeShine" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {blades.map((b, i) => (
        <g key={i} className="blade" style={{ ["--d" as string]: `${b.d}s`, ["--delay" as string]: `${b.delay}s` }}>
          <path
            d={`M${b.x - b.w / 2},${height} Q${b.x + b.lean / 2},${height - b.h * 0.6} ${b.x + b.lean},${height - b.h} Q${b.x + b.lean / 3},${height - b.h * 0.5} ${b.x + b.w / 2},${height} Z`}
            fill={b.fill}
          />
          {i % 4 === 0 && (
            <path
              d={`M${b.x - b.w / 4},${height} Q${b.x + b.lean / 2},${height - b.h * 0.6} ${b.x + b.lean},${height - b.h}`}
              stroke="url(#bladeShine)"
              strokeWidth="1.5"
              fill="none"
            />
          )}
        </g>
      ))}
    </svg>
      {/* Blooms sit outside the stretched SVG so they stay round on narrow screens. */}
      {blades.map(
        (b, i) =>
          b.bloom && (
            <span
              key={i}
              className="blade absolute bottom-0 w-0"
              style={{ left: `${(b.x + b.lean) / 10}%`, height: b.h, ["--d" as string]: `${b.d}s`, ["--delay" as string]: `${b.delay}s` }}
            >
              <span className="absolute -left-[7px] -top-[7px]">
                <Bloom petals={5 + (i % 3)} color={b.bloom} size={14} />
              </span>
            </span>
          ),
      )}
    </div>
  )
}

export function DewDrops({ count = 14 }: { count?: number }) {
  if (isServer) return null
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="dew absolute bottom-6 rounded-full"
          style={{
            left: `${rand(i + 20) * 100}%`,
            width: 6 + rand(i + 21) * 10,
            height: 6 + rand(i + 21) * 10,
            background: "radial-gradient(circle at 30% 30%, #fff, rgba(187,247,208,0.6) 40%, rgba(34,197,94,0.15) 70%)",
            boxShadow: "inset 0 0 4px rgba(255,255,255,0.8)",
            ["--d" as string]: `${7 + rand(i + 22) * 6}s`,
            ["--delay" as string]: `${-rand(i + 23) * 10}s`,
          }}
        />
      ))}
    </div>
  )
}
