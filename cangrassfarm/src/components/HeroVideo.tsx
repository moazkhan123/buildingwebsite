import { useReducedMotion } from "motion/react"

const veils = {
  // Text on the left: heaviest veil behind it, lighter towards the right.
  left: "linear-gradient(90deg, color-mix(in srgb, var(--background) 88%, transparent) 0%, color-mix(in srgb, var(--background) 62%, transparent) 55%, color-mix(in srgb, var(--background) 30%, transparent) 100%)",
  // Centred text: an even veil, a little heavier through the middle.
  center: "radial-gradient(ellipse 70% 60% at 50% 45%, color-mix(in srgb, var(--background) 82%, transparent), color-mix(in srgb, var(--background) 45%, transparent))",
}

// Looping butterfly-and-meadow video behind a hero section, under a sand veil so text
// stays readable. Portrait screens get an upright crop; reduced-motion visitors get the
// still poster. The parent section needs `relative isolate overflow-hidden`.
export function HeroVideo({ veil }: { veil: keyof typeof veils }) {
  const reduce = useReducedMotion()
  return (
    <>
      <video
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        autoPlay={!reduce}
        muted
        loop
        playsInline
        preload={reduce ? "none" : "auto"}
        poster="/video/hero-poster.webp"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/video/hero-tall.webm" type="video/webm" media="(orientation: portrait)" />
        <source src="/video/hero-tall.mp4" type="video/mp4" media="(orientation: portrait)" />
        <source src="/video/hero-wide.webm" type="video/webm" />
        <source src="/video/hero-wide.mp4" type="video/mp4" />
      </video>
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: `${veils[veil]}, linear-gradient(180deg, transparent 70%, var(--background) 100%)` }}
      />
    </>
  )
}
