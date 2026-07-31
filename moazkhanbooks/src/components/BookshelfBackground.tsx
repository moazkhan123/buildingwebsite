import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import libraryPhoto from "@/assets/hero/library.jpeg";
import WalkingFigure from "@/components/WalkingFigure";

export default function BookshelfBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 90]);

  return (
    <div ref={ref} className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute inset-x-0 -top-[6%] h-[118%] bg-cover bg-center"
        style={{ y, backgroundImage: `url(${libraryPhoto})` }}
      />

      {/* Warm lamp glow, gently breathing like a lit reading lamp */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 30% 15%, rgba(217,182,77,0.22), transparent 70%)",
        }}
        animate={
          prefersReducedMotion
            ? undefined
            : { opacity: [0.85, 1, 0.85], scale: [1, 1.04, 1] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Dark gradient overlay for text legibility, tinted to the site's palette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(21,15,10,0.82) 0%, rgba(21,15,10,0.6) 45%, rgba(21,15,10,0.35) 75%, rgba(21,15,10,0.2) 100%), linear-gradient(180deg, rgba(21,15,10,0.35) 0%, rgba(21,15,10,0.5) 55%, var(--background) 100%)",
        }}
      />

      {/* Figures pace on top of the overlay so they read as warmly lit, not lost in the dark */}
      <WalkingFigure topPct={46} fromPct={68} toPct={90} duration={20} heightPx={30} />
      <WalkingFigure topPct={53} fromPct={74} toPct={94} duration={26} delay={4} heightPx={24} />
    </div>
  );
}
