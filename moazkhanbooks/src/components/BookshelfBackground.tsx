import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { buildSpineRow, type Spine } from "@/lib/spineGradient";

// A warm, illustrated bookshelf built entirely from real DOM elements (not a
// flat gradient), so each spine reads as an individual book: varied height,
// a rounded-cloth highlight, and an embossed title band near the top.
const SHELF_HEIGHT = 220;
const SPINES_PER_ROW = 130;
const ROW_SEEDS = [0, 37, 71, 12];

function BookSpine({ spine }: { spine: Spine }) {
  return (
    <div
      className="relative shrink-0 self-end"
      style={{
        width: spine.widthPx,
        height: `${spine.heightPct * 100}%`,
        marginRight: 2,
        borderTop: "2px solid rgba(10,7,4,0.5)",
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        background: `linear-gradient(90deg,
          color-mix(in srgb, ${spine.color} 65%, black) 0%,
          ${spine.color} 18%,
          color-mix(in srgb, ${spine.color} 80%, white) 46%,
          ${spine.color} 72%,
          color-mix(in srgb, ${spine.color} 55%, black) 100%)`,
        boxShadow: "1px 0 0 rgba(0,0,0,0.25)",
      }}
    >
      {/* Embossed title band */}
      <div
        className="absolute inset-x-[15%]"
        style={{ top: `${spine.titleOffsetPct}%`, height: 2, background: "rgba(255,232,190,0.45)" }}
      />
      <div
        className="absolute inset-x-[15%]"
        style={{ top: `${spine.titleOffsetPct + 6}%`, height: 1.5, background: "rgba(255,232,190,0.25)" }}
      />
    </div>
  );
}

function ShelfRow({ seed }: { seed: number }) {
  const spines = buildSpineRow(SPINES_PER_ROW, seed);
  return (
    <div style={{ height: SHELF_HEIGHT }} className="flex flex-col justify-end">
      <div className="flex items-end overflow-hidden" style={{ height: "88%" }}>
        {spines.map((spine, i) => (
          <BookSpine key={i} spine={spine} />
        ))}
      </div>
      {/* Wooden shelf ledge */}
      <div
        style={{
          height: 12,
          background:
            "linear-gradient(180deg, rgba(10,7,4,0.85) 0%, rgba(35,24,14,0.95) 40%, rgba(10,7,4,0.85) 100%)",
          boxShadow: "0 1px 0 rgba(255,235,190,0.08) inset, 0 3px 6px rgba(0,0,0,0.4)",
        }}
      />
    </div>
  );
}

export default function BookshelfBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 120]);

  return (
    <div ref={ref} className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute inset-x-0 -top-[10%] h-[130%]"
        style={{ y, background: "linear-gradient(180deg, #241a12 0%, #1b130c 60%, #150f0a 100%)" }}
      >
        {ROW_SEEDS.map((seed, i) => (
          <ShelfRow key={i} seed={seed} />
        ))}
      </motion.div>

      {/* Warm lamp glow, gently breathing like a lit reading lamp */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 30% 15%, rgba(217,182,77,0.28), transparent 70%)",
        }}
        animate={
          prefersReducedMotion
            ? undefined
            : { opacity: [0.85, 1, 0.85], scale: [1, 1.04, 1] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Dark gradient overlay for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(21,15,10,0.55) 0%, rgba(21,15,10,0.72) 55%, var(--background) 100%)",
        }}
      />
    </div>
  );
}
