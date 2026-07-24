import { motion, useReducedMotion } from "motion/react";
import { Feather } from "lucide-react";

const GOLD = "#c9a35a";

export default function Logo() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.a
      href="#"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="flex items-center gap-4"
    >
      <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-foreground/5 text-foreground">
        <span className="font-serif text-3xl leading-none">M</span>
        <motion.span
          className="absolute -right-3 -top-3"
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  rotate: [30, 42, 30],
                  y: [0, -3, 0],
                }
          }
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Feather className="h-9 w-9" style={{ color: GOLD }} strokeWidth={1.5} />
        </motion.span>
      </span>

      <span className="leading-none">
        <span className="block font-serif text-2xl font-semibold tracking-tight text-foreground">
          Moaz Khan
        </span>
        <span
          className="block text-xs font-medium uppercase tracking-[0.3em]"
          style={{ color: GOLD }}
        >
          Books
        </span>
      </span>
    </motion.a>
  );
}
