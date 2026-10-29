// Parallax hero (adapted from a 21st.dev component): stacked transparent layers that drift,
// tilt and move in depth with the pointer. The default layers are the nursery's own landscape,
// drawn as SVGs in /img/parallax (sky, misty hills, maple trees, striped lawn, fog), so nothing
// loads from another site.
import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/cn"

export interface ParallaxLayer {
  src: string
  alt: string
  speedX: number
  speedY: number
  speedZ: number
  rotation: number
  className?: string
  zIndex: number
  initialTop: string
  initialLeft: string
  width: string
}

interface ParallaxHeroProps {
  layers?: ParallaxLayer[]
  /** Big headline, used when no children are given. */
  title?: string
  /** Content shown over the scene instead of the title (moves with a gentle parallax too). */
  children?: ReactNode
  className?: string
  /** Vertical position of the content's centre. */
  contentTop?: string
  /** Fade the bottom edge into the page background. */
  fadeBottom?: boolean
}

const layer = (l: Omit<ParallaxLayer, "alt" | "speedZ" | "rotation"> & Partial<ParallaxLayer>): ParallaxLayer => ({
  alt: "",
  speedZ: 0,
  rotation: 0,
  ...l,
})

export const nurseryLayers: ParallaxLayer[] = [
  layer({ src: "/img/parallax/sky.svg", speedX: 0.02, speedY: 0.025, zIndex: 1, initialTop: "50%", initialLeft: "50%", width: "max(3200px, 230vw)" }),
  layer({ src: "/img/parallax/hills-far.svg", speedX: 0.05, speedY: 0.02, zIndex: 2, initialTop: "calc(100% - 300px)", initialLeft: "50%", width: "2600px" }),
  layer({ src: "/img/parallax/fog-far.svg", speedX: 0.22, speedY: 0.12, zIndex: 3, initialTop: "calc(100% - 330px)", initialLeft: "calc(50% + 200px)", width: "2400px" }),
  layer({ src: "/img/parallax/hills-mid.svg", speedX: 0.08, speedY: 0.03, speedZ: 0.05, rotation: 0.02, zIndex: 4, initialTop: "calc(100% - 210px)", initialLeft: "calc(50% - 150px)", width: "2600px" }),
  // Trees shrink and move in on narrow screens; their tops are placed so the trunks stand on the lawn.
  layer({ src: "/img/parallax/trees-left.svg", speedX: 0.12, speedY: 0.05, speedZ: 0.2, rotation: 0.08, zIndex: 5, initialTop: "calc(100% - 150px - min(560px, 60vw) * 0.344)", initialLeft: "calc(50% - min(560px, 40vw))", width: "min(560px, 60vw)" }),
  layer({ src: "/img/parallax/trees-right.svg", speedX: 0.12, speedY: 0.05, speedZ: 0.2, rotation: 0.08, zIndex: 5, initialTop: "calc(100% - 145px - min(560px, 60vw) * 0.344)", initialLeft: "calc(50% + min(570px, 41vw))", width: "min(560px, 60vw)" }),
  layer({ src: "/img/parallax/lawn.svg", speedX: 0.15, speedY: 0.06, speedZ: 0.1, rotation: 0.03, zIndex: 6, initialTop: "calc(100% - 250px)", initialLeft: "50%", width: "2800px" }),
  layer({ src: "/img/parallax/fog-near.svg", speedX: 0.3, speedY: 0.1, zIndex: 7, initialTop: "calc(100% - 330px)", initialLeft: "calc(50% - 100px)", width: "2600px", className: "opacity-40" }),
]

export function ParallaxHero({ layers = nurseryLayers, title = "HERO", children, className, contentTop = "calc(50% - 130px)", fadeBottom }: ParallaxHeroProps) {
  const layerRefs = useRef<(HTMLImageElement | null)[]>([])
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const move = (el: HTMLElement, cursorX: number, x: number, y: number, rotate: number, s: { x: number; y: number; z: number; r: number }) => {
      const left = el.getBoundingClientRect().left + el.offsetWidth / 2
      const side = left < window.innerWidth / 2 ? 1 : -1
      const z = (cursorX - left) * side * 0.1
      el.style.transform = `perspective(2300px) translateZ(${z * s.z}px) rotateY(${rotate * s.r}deg) translateX(calc(-50% + ${-x * s.x}px)) translateY(calc(-50% + ${y * s.y}px))`
    }

    let frame = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const x = e.clientX - window.innerWidth / 2
        const y = e.clientY - window.innerHeight / 2
        const rotate = (x / (window.innerWidth / 2)) * 20
        layerRefs.current.forEach((el, i) => {
          const l = layers[i]
          if (el && l) move(el, e.clientX, x, y, rotate, { x: l.speedX, y: l.speedY, z: l.speedZ, r: l.rotation })
        })
        if (textRef.current) move(textRef.current, e.clientX, x, y, rotate, { x: 0.03, y: 0.02, z: 0.04, r: 0.02 })
      })
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onMove)
    }
  }, [layers])

  return (
    <div className={cn("relative h-[100svh] min-h-[600px] w-full overflow-hidden", className)}>
      {/* Soft warm vignette that keeps the edges calm. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[100] bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(90,50,20,0.28))]" />
      {fadeBottom && <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[101] h-24 bg-gradient-to-b from-transparent to-[var(--background)]" />}

      {layers.map((l, i) => (
        <img
          key={l.src + i}
          ref={(el) => {
            layerRefs.current[i] = el
          }}
          src={l.src}
          alt={l.alt}
          aria-hidden={l.alt ? undefined : true}
          draggable={false}
          decoding="async"
          className={cn("pointer-events-none absolute max-w-none select-none transition-transform duration-[450ms] ease-out", l.className)}
          style={{ width: l.width, top: l.initialTop, left: l.initialLeft, zIndex: l.zIndex, transform: "translate(-50%, -50%)" }}
        />
      ))}

      <div
        ref={textRef}
        className="absolute left-1/2 z-[110] w-full transition-transform duration-[450ms] ease-out"
        style={{ top: contentTop, transform: "translate(-50%, -50%)" }}
      >
        {children ?? (
          <h1 className="text-center text-[20rem] font-black leading-[0.8] text-white max-lg:text-[15rem] max-md:text-[5.8rem] max-sm:text-[3.3rem]">{title}</h1>
        )}
      </div>
    </div>
  )
}
