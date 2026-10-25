import { useReducedMotion } from "motion/react"
import { useEffect, useRef } from "react"

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
  const ref = useRef<HTMLVideoElement>(null)

  // iOS Safari only autoplays when the `muted` attribute is on the element, which React
  // doesn't write (it only sets the property), so set both and start playback ourselves.
  // If autoplay is still refused (e.g. Low Power Mode), start on the first touch or scroll.
  useEffect(() => {
    const v = ref.current
    if (!v || reduce) return
    v.muted = true
    v.defaultMuted = true
    v.setAttribute("muted", "")
    const events = ["touchstart", "pointerdown", "scroll", "keydown"] as const
    const stopListening = () => events.forEach((e) => window.removeEventListener(e, tryPlay))
    // Keep listening until playback actually starts; a scroll the browser fires on its own
    // during load must not use up the fallback.
    function tryPlay() {
      if (!v!.paused) return stopListening()
      v!.play().then(stopListening, () => {})
    }
    events.forEach((e) => window.addEventListener(e, tryPlay, { passive: true }))
    tryPlay()
    const onVisible = () => document.visibilityState === "visible" && tryPlay()
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      stopListening()
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [reduce])

  return (
    <>
      <video
        ref={ref}
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
        {/* MP4 (H.264) first: the most reliable format on iPhones; WebM as a fallback. */}
        <source src="/video/hero-tall.mp4" type="video/mp4" media="(orientation: portrait)" />
        <source src="/video/hero-tall.webm" type="video/webm" media="(orientation: portrait)" />
        <source src="/video/hero-wide.mp4" type="video/mp4" />
        <source src="/video/hero-wide.webm" type="video/webm" />
      </video>
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: `${veils[veil]}, linear-gradient(180deg, transparent 70%, var(--background) 100%)` }}
      />
    </>
  )
}
