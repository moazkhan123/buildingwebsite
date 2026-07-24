import { motion } from "motion/react";
import BookCover from "@/components/BookCover";
import type { Book } from "@/data/books";

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function BookCard({ book }: { book: Book }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group flex flex-col gap-4"
    >
      <BookCover title={book.title} color={book.coverColor} />
      <div>
        <h3 className="font-serif text-xl text-foreground">{book.title}</h3>
        <p className="mt-1 text-sm font-medium uppercase tracking-wide text-accent">
          {book.genre}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {book.description}
        </p>
      </div>
    </motion.div>
  );
}
