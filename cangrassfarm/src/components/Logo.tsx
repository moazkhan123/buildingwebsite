import { useId } from "react"
import { cn } from "@/lib/cn"

// The maple leaf from the Canadian flag (same outline and proportions).
const LEAF =
  "m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z"

// Simple red maple leaf. It tilts on hover of the surrounding .logo-hover element (see .cgf-leaf in index.css).
export function LogoMark({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "")
  return (
    <svg viewBox="-2150 -2100 4300 4300" className={cn("shrink-0 overflow-visible", className)} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-red`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b0503a" />
          <stop offset="1" stopColor="#7a2e1a" />
        </linearGradient>
      </defs>
      <path className="cgf-leaf" d={LEAF} fill={`url(#${id}-red)`} />
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
