import { motion } from "motion/react";
import { Feather } from "lucide-react";

const GOLD = "#c9a35a";

export default function Logo() {
  return (
    <motion.a
      href="#"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="flex items-center gap-3"
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-foreground/5 text-foreground">
        <span className="font-serif text-xl leading-none">M</span>
        <Feather
          className="absolute -right-2.5 -top-2.5 h-6 w-6 rotate-[35deg]"
          style={{ color: GOLD }}
          strokeWidth={1.5}
        />
      </span>

      <span className="leading-none">
        <span className="block font-serif text-base font-semibold tracking-tight text-foreground">
          Moaz Khan
        </span>
        <span
          className="block text-[10px] font-medium uppercase tracking-[0.3em]"
          style={{ color: GOLD }}
        >
          Books
        </span>
      </span>
    </motion.a>
  );
}
