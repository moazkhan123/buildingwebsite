import { motion } from "motion/react";
import { BookOpen } from "lucide-react";

export default function Logo() {
  return (
    <motion.a
      href="#"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="flex items-center gap-2.5"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <BookOpen className="h-4 w-4" />
      </span>
      <span className="font-serif text-lg leading-none tracking-tight">
        Moaz Khan
        <span className="block text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Books
        </span>
      </span>
    </motion.a>
  );
}
