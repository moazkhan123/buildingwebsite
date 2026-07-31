import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  animate,
  type MotionValue,
} from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookCover from "@/components/BookCover";
import BookDetailPanel from "@/components/BookDetailPanel";
import type { Book } from "@/data/books";

const CARD_SPACING = 150;
const SPRING = { type: "spring", stiffness: 260, damping: 26 } as const;
const TILT_SPRING = { type: "spring", stiffness: 300, damping: 20 } as const;
const TILT_RANGE = 16;

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
  const prefersReducedMotion = useReducedMotion();
  const offset = useTransform(position, (p) => circularOffset(index, p, length));
  const x = useTransform(offset, (o) => o * CARD_SPACING);
  const z = useTransform(offset, (o) => -Math.abs(o) * 150);
  const scale = useTransform(offset, (o) => 1 - Math.min(Math.abs(o), 1) * 0.22);
  const opacity = useTransform(offset, (o) => {
    const abs = Math.abs(o);
    return abs <= 2.5 ? Math.max(1 - abs * 0.32, 0) : 0;
  });

  // Pointer-driven tilt layers on top of the base coverflow rotation, for a
  // card that subtly responds to the mouse instead of sitting perfectly flat.
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateY = useTransform([offset, tiltY], ([o, t]) => (o as number) * -32 + (t as number));
  const rotateX = tiltX;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltY.set(px * TILT_RANGE);
    tiltX.set(-py * TILT_RANGE);
  };
  const handleMouseLeave = () => {
    animate(tiltX, 0, TILT_SPRING);
    animate(tiltY, 0, TILT_SPRING);
  };

  const visible = Math.abs(circularOffset(index, active, length)) <= 2;
  const isActive = index === active;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 w-[180px] -ml-[90px] -mt-[135px] cursor-pointer"
      style={{
        transformStyle: "preserve-3d",
        pointerEvents: visible ? "auto" : "none",
        x,
        z,
        rotateY,
        rotateX,
        scale,
        opacity,
      }}
      animate={
        isActive && !prefersReducedMotion
          ? { y: [0, -6, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } }
          : { y: 0, transition: { duration: 0.3 } }
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
  const prefersReducedMotion = useReducedMotion();
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
    <motion.div
      className="flex flex-col items-center gap-10"
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence mode="wait">
        <motion.h3
          key={activeCategory}
          initial={{ opacity: 0, y: -10, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.94 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
          whileDrag={{ scale: 0.98 }}
          transition={{ scale: { duration: 0.2 } }}
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
        <motion.button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous book"
          whileHover={prefersReducedMotion ? undefined : { scale: 1.08, x: -2 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="glass reveal elevation-1 flex h-9 w-9 items-center justify-center rounded-full transition-shadow hover:elevation-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </motion.button>

        <div className="flex max-w-[240px] flex-wrap justify-center gap-1.5">
          {books.map((book, i) => (
            <motion.button
              key={book.title}
              type="button"
              onClick={() => commit(i)}
              aria-label={`Go to ${book.title}`}
              animate={{ scale: i === active ? 1.4 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              style={
                i > 0 && books[i].category !== books[i - 1].category
                  ? { marginLeft: 8 }
                  : undefined
              }
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === active ? "bg-accent" : "bg-border"
              }`}
            />
          ))}
        </div>

        <motion.button
          type="button"
          onClick={() => go(1)}
          aria-label="Next book"
          whileHover={prefersReducedMotion ? undefined : { scale: 1.08, x: 2 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="glass reveal elevation-1 flex h-9 w-9 items-center justify-center rounded-full transition-shadow hover:elevation-2"
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>

      <BookDetailPanel book={books[active]} />
    </motion.div>
  );
}
