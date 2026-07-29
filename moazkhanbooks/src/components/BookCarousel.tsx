import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  animate,
  type MotionValue,
} from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookCover from "@/components/BookCover";
import BookDetailPanel from "@/components/BookDetailPanel";
import type { Book } from "@/data/books";

const CARD_SPACING = 150;
const SPRING = { type: "spring", stiffness: 260, damping: 26 } as const;

function circularOffset(index: number, position: number, length: number) {
  const raw = index - position;
  return (((raw + length / 2) % length) + length) % length - length / 2;
}

function nearestEquivalent(from: number, to: number, length: number) {
  const diff = (((to - from + length / 2) % length) + length) % length - length / 2;
  return from + diff;
}

function CarouselCard({
  book,
  index,
  length,
  position,
  active,
  onSelect,
}: {
  book: Book;
  index: number;
  length: number;
  position: MotionValue<number>;
  active: number;
  onSelect: () => void;
}) {
  const offset = useTransform(position, (p) => circularOffset(index, p, length));
  const x = useTransform(offset, (o) => o * CARD_SPACING);
  const z = useTransform(offset, (o) => -Math.abs(o) * 150);
  const rotateY = useTransform(offset, (o) => o * -32);
  const scale = useTransform(offset, (o) => 1 - Math.min(Math.abs(o), 1) * 0.22);
  const opacity = useTransform(offset, (o) => {
    const abs = Math.abs(o);
    return abs <= 2.5 ? Math.max(1 - abs * 0.32, 0) : 0;
  });

  const visible = Math.abs(circularOffset(index, active, length)) <= 2;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 w-[180px] -ml-[90px] -mt-[135px] cursor-pointer"
      style={{
        transformStyle: "preserve-3d",
        pointerEvents: visible ? "auto" : "none",
        x,
        z,
        rotateY,
        scale,
        opacity,
      }}
      onClick={onSelect}
      aria-hidden={!visible}
    >
      <BookCover
        title={book.title}
        color={book.coverColor}
        cover={book.cover}
        shouldLoad={visible}
      />
    </motion.div>
  );
}

export default function BookCarousel({ books }: { books: Book[] }) {
  const [active, setActive] = useState(0);
  const length = books.length;
  const position = useMotionValue(0);
  const dragStart = useRef(0);

  const settleTo = (target: number) => {
    animate(position, nearestEquivalent(position.get(), target, length), SPRING);
  };

  const commit = (index: number) => {
    setActive(index);
    settleTo(index);
  };

  const go = (dir: 1 | -1) => {
    const next = (active + dir + length) % length;
    setActive(next);
    settleTo(next);
  };

  const activeCategory = books[active].category;

  return (
    <div className="flex flex-col items-center gap-10">
      <AnimatePresence mode="wait">
        <motion.h3
          key={activeCategory}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.25 }}
          className="font-serif text-4xl uppercase tracking-[0.15em] text-accent sm:text-5xl"
        >
          {activeCategory}
        </motion.h3>
      </AnimatePresence>

      <div
        className="relative h-[400px] w-full max-w-3xl overflow-hidden select-none outline-none"
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
          dragElastic={0}
          dragMomentum={false}
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={() => {
            dragStart.current = position.get();
          }}
          onDrag={(_, info) => {
            position.set(dragStart.current - info.offset.x / CARD_SPACING);
          }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60 || info.velocity.x < -400) go(1);
            else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
            else settleTo(active);
          }}
        >
          {books.map((book, i) => (
            <CarouselCard
              key={book.title}
              book={book}
              index={i}
              length={length}
              position={position}
              active={active}
              onSelect={() => commit(i)}
            />
          ))}
        </motion.div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous book"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-card"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex max-w-[240px] flex-wrap justify-center gap-1.5">
          {books.map((book, i) => (
            <button
              key={book.title}
              type="button"
              onClick={() => commit(i)}
              aria-label={`Go to ${book.title}`}
              style={
                i > 0 && books[i].category !== books[i - 1].category
                  ? { marginLeft: 8 }
                  : undefined
              }
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
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-card"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <BookDetailPanel book={books[active]} />
    </div>
  );
}
