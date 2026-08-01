import { motion, useReducedMotion } from "motion/react";
import { buildSpineGradient } from "@/lib/spineGradient";

const SPINE_GRADIENT = buildSpineGradient();

interface Blob {
  color: string;
  size: number;
  top: string;
  left: string;
  duration: number;
  range: number;
}

const blobs: Blob[] = [
  { color: "#e0b34d", size: 520, top: "-10%", left: "5%", duration: 26, range: 60 },
  { color: "#4a2f7a", size: 460, top: "15%", left: "70%", duration: 32, range: 80 },
  { color: "#8a63d6", size: 400, top: "60%", left: "10%", duration: 22, range: 50 },
  { color: "#5c3a99", size: 380, top: "70%", left: "65%", duration: 28, range: 70 },
];

export default function AnimatedBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />

      {/* Faint library shelf texture, present behind every section */}
      <motion.div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: SPINE_GRADIENT,
          backgroundSize: "100% 100%",
        }}
        animate={prefersReducedMotion ? undefined : { backgroundPositionX: ["0%", "100%"] }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      />

      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: blob.size,
            height: blob.size,
            top: blob.top,
            left: blob.left,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            opacity: 0.25,
          }}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: [0, blob.range, -blob.range * 0.6, 0],
                  y: [0, -blob.range * 0.7, blob.range * 0.5, 0],
                  scale: [1, 1.08, 0.96, 1],
                }
          }
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-background/40" />
    </div>
  );
}
