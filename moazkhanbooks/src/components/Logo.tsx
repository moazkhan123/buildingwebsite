import { motion, useReducedMotion } from "motion/react";
import { Feather } from "lucide-react";

const GOLD = "#cfa04a";

export default function Logo() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.a
      href="#"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="flex items-center gap-3"
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-foreground/5 text-foreground">
        <span className="font-serif text-xl leading-none">M</span>
        <motion.span
          className="absolute -right-2.5 -top-2.5"
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  rotate: [30, 42, 30],
                  y: [0, -2, 0],
                }
          }
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Feather className="h-6 w-6" style={{ color: GOLD }} strokeWidth={1.5} />
        </motion.span>
      </span>

      <span className="leading-none">
        <span className="block whitespace-nowrap font-serif text-base font-semibold tracking-tight text-foreground">
          Moaz Khan
        </span>
        <span className="block text-[10px] font-medium uppercase tracking-[0.3em] text-accent">
          Books
        </span>
      </span>
    </motion.a>
  );
}
