import { motion, useReducedMotion } from "motion/react"

// Gooey morphing gel blobs that sit behind the whole site.
export function GelBackdrop() {
  const reduce = useReducedMotion()
  const blobs = [
    { c: "var(--primary-2)", x: "8%", y: "12%", s: 420, o: 0.28 },
    { c: "var(--sun)", x: "72%", y: "4%", s: 320, o: 0.18 },
    { c: "var(--primary)", x: "60%", y: "55%", s: 480, o: 0.16 },
    { c: "var(--blade-3)", x: "-6%", y: "70%", s: 380, o: 0.2 },
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
    return { x, h, w, lean, fill, d: 3 + rand(i + 4) * 3, delay: -rand(i + 5) * 4 }
  })
  return (
    <svg
      aria-hidden
      viewBox={`0 0 1000 ${height}`}
      preserveAspectRatio="none"
      className={`pointer-events-none block w-full ${className}`}
      style={{ height }}
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
  )
}

export function DewDrops({ count = 14 }: { count?: number }) {
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
