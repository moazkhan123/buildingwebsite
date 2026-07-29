import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

// A warm, illustrated bookshelf built entirely from layered CSS gradients —
// no external image asset, so there's nothing to license or fail to load.
const SPINE_COLORS = [
  "#8a6d1f", "#6b1f28", "#1f3350", "#2f4a2b", "#c9a35a",
  "#5a2f4a", "#3a2b6b", "#7a2331", "#1c2b45", "#8a7228",
  "#4a3b1f", "#17213d", "#b8862b", "#3a3f4a", "#6b1f28",
];

function buildSpineGradient() {
  const stops: string[] = [];
  let pos = 0;
  for (let i = 0; i < 40; i++) {
    const color = SPINE_COLORS[i % SPINE_COLORS.length];
    const width = 26 + ((i * 13) % 22); // varied spine widths, deterministic
    stops.push(`${color} ${pos}px ${pos + width - 2}px`);
    pos += width;
    stops.push(`rgba(21,15,10,0.35) ${pos - 2}px ${pos}px`); // gutter between spines
  }
  return `repeating-linear-gradient(90deg, ${stops.join(", ")})`;
}

const SPINE_GRADIENT = buildSpineGradient();
const SHELF_HEIGHT = 220;

export default function BookshelfBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 120]);

  return (
    <div ref={ref} className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute inset-x-0 -top-[10%] h-[130%]"
        style={{
          y,
          backgroundImage: `${SPINE_GRADIENT}, repeating-linear-gradient(180deg, rgba(10,7,4,0.8) 0 10px, rgba(255,235,190,0.07) 10px 12px, transparent 12px ${SHELF_HEIGHT}px), linear-gradient(180deg, #241a12 0%, #1b130c 60%, #150f0a 100%)`,
          backgroundSize: `100% ${SHELF_HEIGHT}px, 100% ${SHELF_HEIGHT}px, 100% 100%`,
          filter: "blur(1px)",
        }}
      />

      {/* Warm lamp glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 30% 15%, rgba(217,182,77,0.28), transparent 70%)",
        }}
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
