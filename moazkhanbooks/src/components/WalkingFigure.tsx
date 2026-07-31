import { motion, useReducedMotion } from "motion/react";

interface WalkingFigureProps {
  topPct: number;
  fromPct: number;
  toPct: number;
  duration: number;
  delay?: number;
  heightPx: number;
}

/** A small silhouette that paces back and forth in the distance -- a hint of
 * life in the library, not a focal illustration. */
export default function WalkingFigure({
  topPct,
  fromPct,
  toPct,
  duration,
  delay = 0,
  heightPx,
}: WalkingFigureProps) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;

  return (
    <motion.div
      className="absolute"
      style={{ top: `${topPct}%`, height: heightPx, width: heightPx * 0.4 }}
      animate={{
        left: [`${fromPct}%`, `${toPct}%`, `${fromPct}%`],
        opacity: [0, 0.85, 0.85, 0],
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <motion.svg
        viewBox="0 0 10 26"
        className="h-full w-full"
        animate={{ y: [0, -1.4, 0, -1.4, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="5" cy="2.4" r="2" fill="rgba(240,214,158,0.85)" />
        <rect x="2.6" y="6" width="4.8" height="8" rx="1.4" fill="rgba(240,214,158,0.85)" />
        <path
          d="M3.2 14 L1.6 23 M6.8 14 L8.4 23"
          stroke="rgba(240,214,158,0.85)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </motion.svg>
    </motion.div>
  );
}
