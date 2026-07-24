import { motion, useReducedMotion } from "motion/react";

interface Blob {
  color: string;
  size: number;
  top: string;
  left: string;
  duration: number;
  range: number;
}

const blobs: Blob[] = [
  { color: "#7a2331", size: 520, top: "-10%", left: "5%", duration: 26, range: 60 },
  { color: "#2f4a2b", size: 460, top: "15%", left: "70%", duration: 32, range: 80 },
  { color: "#8a6d1f", size: 400, top: "60%", left: "10%", duration: 22, range: 50 },
  { color: "#3a2b6b", size: 380, top: "70%", left: "65%", duration: 28, range: 70 },
];

export default function AnimatedBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
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
