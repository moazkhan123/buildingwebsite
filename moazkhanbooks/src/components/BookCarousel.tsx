import { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookCover from "@/components/BookCover";
import BookDetailPanel from "@/components/BookDetailPanel";
import type { Book } from "@/data/books";

function circularOffset(index: number, active: number, length: number) {
  let offset = index - active;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

export default function BookCarousel({ books }: { books: Book[] }) {
  const [active, setActive] = useState(0);
  const length = books.length;

  const go = (dir: 1 | -1) => setActive((prev) => (prev + dir + length) % length);

  return (
    <div className="flex flex-col items-center gap-10">
      <div
        className="relative h-[400px] w-full max-w-3xl select-none outline-none"
        style={{ perspective: 1200 }}
        tabIndex={0}
        role="region"
        aria-label="Book carousel"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
          drag="x"
          dragElastic={0.15}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -80) go(1);
            else if (info.offset.x > 80) go(-1);
          }}
        >
          {books.map((book, i) => {
            const offset = circularOffset(i, active, length);
            const abs = Math.abs(offset);
            const visible = abs <= 2;

            return (
              <motion.div
                key={book.title}
                className="absolute left-1/2 top-1/2 w-[180px] -ml-[90px] -mt-[135px] cursor-pointer"
                style={{
                  transformStyle: "preserve-3d",
                  pointerEvents: visible ? "auto" : "none",
                }}
                animate={{
                  x: offset * 150,
                  z: -abs * 150,
                  rotateY: offset * -32,
                  scale: offset === 0 ? 1 : 0.78,
                  opacity: visible ? 1 - abs * 0.32 : 0,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                onClick={() => setActive(i)}
                aria-hidden={!visible}
              >
                <BookCover title={book.title} color={book.coverColor} cover={book.cover} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous book"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:bg-card"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex max-w-[220px] flex-wrap justify-center gap-1.5">
          {books.map((book, i) => (
            <button
              key={book.title}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Go to ${book.title}`}
              className={`h-1.5 w-1.5 rounded-full transition ${
                i === active ? "bg-accent" : "bg-border"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next book"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:bg-card"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <BookDetailPanel book={books[active]} />
    </div>
  );
}
