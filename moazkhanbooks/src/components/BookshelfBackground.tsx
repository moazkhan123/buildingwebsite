import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import heroVideoWebm from "@/assets/hero/library.webm";
import heroVideoMp4 from "@/assets/hero/library.mp4";
import heroPoster from "@/assets/hero/library-poster.jpg";

export default function BookshelfBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 90]);

  useEffect(() => {
    if (prefersReducedMotion) videoRef.current?.pause();
  }, [prefersReducedMotion]);

  return (
    <div ref={ref} className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <motion.div className="absolute inset-x-0 -top-[6%] h-[118%]" style={{ y }}>
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          style={{ objectPosition: "50% 40%" }}
          poster={heroPoster}
          autoPlay={!prefersReducedMotion}
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={heroVideoWebm} type="video/webm" />
          <source src={heroVideoMp4} type="video/mp4" />
        </video>
      </motion.div>

      {/* Warm lamp glow, gently breathing like a lit reading lamp */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 30% 15%, rgba(224,179,77,0.22), transparent 70%)",
        }}
        animate={
          prefersReducedMotion
            ? undefined
            : { opacity: [0.85, 1, 0.85], scale: [1, 1.04, 1] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Amethyst-tinted overlay for text legibility, matching the Midnight Jewel palette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(27,17,64,0.82) 0%, rgba(32,20,72,0.6) 45%, rgba(38,24,80,0.35) 75%, rgba(38,24,80,0.2) 100%), linear-gradient(180deg, rgba(27,17,64,0.35) 0%, rgba(27,17,64,0.5) 55%, var(--background) 100%)",
        }}
      />
    </div>
  );
}
