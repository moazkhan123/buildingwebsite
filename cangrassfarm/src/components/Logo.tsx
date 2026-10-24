import { useId } from "react"
import { cn } from "@/lib/cn"

const petals = [0, 60, 120, 180, 240, 300]

// "Bloom & Lawn" emblem: a gel badge with grass growing in and a flower that
// spins when the surrounding .logo-hover element is hovered. Animations live
// in index.css (.cgf-*) and switch off for reduced motion.
export function LogoMark({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "")
  return (
    <svg viewBox="0 0 64 64" className={cn("cgf-mark shrink-0 overflow-visible", className)} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-gel`} cx="35%" cy="28%" r="80%">
          <stop offset="0" stopColor="#6ee7a0" />
          <stop offset=".45" stopColor="#22a456" />
          <stop offset="1" stopColor="#0d4f27" />
        </radialGradient>
        <radialGradient id={`${id}-sun`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#f59e0b" />
        </radialGradient>
        <clipPath id={`${id}-disc`}>
          <circle cx="32" cy="32" r="29" />
        </clipPath>
      </defs>
      <g className="cgf-badge">
        <circle cx="32" cy="32" r="30" fill={`url(#${id}-gel)`} />
        <g clipPath={`url(#${id}-disc)`}>
          <path className="cgf-blade" d="M14 58 Q16 46 12 37 Q20 45 19 58Z" fill="#bbf7d0" />
          <path className="cgf-blade" d="M20 58 Q23 42 21 30 Q28 44 25 58Z" fill="#86efac" />
          <path className="cgf-blade" d="M38 58 Q41 44 47 34 Q45 47 43 58Z" fill="#86efac" />
          <path className="cgf-blade" d="M44 58 Q48 47 53 40 Q51 50 49 58Z" fill="#bbf7d0" />
          <path className="cgf-blade" d="M29 58 Q30 48 27 42 Q33 48 34 58Z" fill="#dcfce7" />
          <g className="cgf-bob">
            <path d="M32 58 C31 48 33 38 32 28" stroke="#dcfce7" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M32 44 Q38 39 42 42 Q37 46 32 44Z" fill="#bbf7d0" />
            <g className="cgf-pop">
              <g className="cgf-spin">
                {petals.map((r) => (
                  <ellipse key={r} cx="32" cy="15" rx="4" ry="6.5" fill="#fff" transform={`rotate(${r} 32 22)`} />
                ))}
                <circle cx="32" cy="22" r="5" fill={`url(#${id}-sun)`} />
              </g>
            </g>
          </g>
          <ellipse cx="25" cy="13" rx="15" ry="6" fill="#fff" opacity=".28" />
          <rect className="cgf-shine" x="20" y="-10" width="10" height="90" fill="#fff" opacity=".35" />
        </g>
        <circle cx="32" cy="32" r="29.5" fill="none" stroke="#fff" strokeOpacity=".55" />
      </g>
    </svg>
  )
}

export function Wordmark({ className, size = "md", plain }: { className?: string; size?: "md" | "lg"; plain?: boolean }) {
  return (
    <span className={cn("block leading-none", plain && "cgf-word-plain", className)}>
      <span
        className={cn(
          "cgf-word block whitespace-nowrap font-serif font-bold",
          size === "lg" ? "text-2xl sm:text-[1.7rem]" : "text-lg lg:text-[1.3rem]",
        )}
      >
        Canadian Grass Farm
      </span>
      <span className="cgf-tagline mt-1.5 flex items-center gap-1.5 font-sans text-[10.5px] font-bold uppercase tracking-[0.24em]">
        <span className="h-0.5 w-3.5 rounded-full bg-sun" aria-hidden />& Flower Nursery
      </span>
    </span>
  )
}
