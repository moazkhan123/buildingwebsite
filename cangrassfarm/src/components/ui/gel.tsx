import { motion, type HTMLMotionProps } from "motion/react"
import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

export const spring = { type: "spring", stiffness: 380, damping: 30 } as const

export function GelButton({ className, variant = "green", ...props }: HTMLMotionProps<"a"> & { variant?: "green" | "sun" | "glass" }) {
  return (
    <motion.a
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={spring}
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold",
        variant === "green" && "gel-btn",
        variant === "sun" && "gel-btn gel-btn-sun",
        variant === "glass" && "gel text-foreground",
        className,
      )}
      {...props}
    />
  )
}

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({ eyebrow, title, children, id }: { eyebrow: string; title: string; children?: ReactNode; id?: string }) {
  return (
    <Reveal className="mx-auto mb-10 max-w-2xl text-center">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 id={id} className="text-balance text-3xl font-semibold sm:text-4xl">
        {title}
      </h2>
      {children && <p className="mt-3 text-muted-foreground">{children}</p>}
    </Reveal>
  )
}

// Segmented control with a liquid pill that slides between options.
export function GelSegment<T extends string>({
  options,
  value,
  onChange,
  name,
  label,
}: {
  options: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
  name: string
  label: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className="gel grid auto-cols-fr grid-flow-col gap-1 rounded-3xl p-1.5">
      {options.map((o) => {
        const active = o.id === value
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.id)}
            className={cn(
              "relative min-h-11 cursor-pointer rounded-2xl px-2 py-2 text-sm font-semibold leading-tight transition-colors duration-200",
              active ? "text-on-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && <motion.span layoutId={`seg-${name}`} transition={spring} className="gel-btn absolute inset-0 rounded-2xl" />}
            <span className="relative">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}
