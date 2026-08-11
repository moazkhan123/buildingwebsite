import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useReveal } from "@/lib/useReveal";
import MarketLinks from "@/components/MarketLinks";
import type { MarketLinks as MarketLinksData } from "@/data/books";

interface SampleReaderProps {
  bookTitle: string;
  loadPages: () => Promise<string[]>;
  open: boolean;
  onClose: () => void;
  links?: MarketLinksData;
}

export default function SampleReader({
  bookTitle,
  loadPages,
  open,
  onClose,
  links,
}: SampleReaderProps) {
  const [pages, setPages] = useState<string[] | null>(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const prefersReducedMotion = useReducedMotion();
  const closeReveal = useReveal<HTMLButtonElement>();
  const prevReveal = useReveal<HTMLButtonElement>();
  const nextReveal = useReveal<HTMLButtonElement>();

  const total = pages?.length ?? 0;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  useEffect(() => {
    setPages(null);
    setIndex(0);
  }, [loadPages]);

  useEffect(() => {
    if (!open || pages) return;
    let cancelled = false;
    loadPages().then((loaded) => {
      if (!cancelled) setPages(loaded);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, loadPages, pages]);

  const goTo = (next: number) => {
    if (next < 0 || next >= total) return;
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setIndex(0), 200);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      else if (e.key === "ArrowRight") goTo(index + 1);
      else if (e.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, total]);

  const pageVariants = {
    enter: (dir: number) => ({ rotateY: dir > 0 ? 90 : -90, opacity: 0 }),
    center: { rotateY: 0, opacity: 1 },
    exit: (dir: number) => ({ rotateY: dir > 0 ? -90 : 90, opacity: 0 }),
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="glass elevation-4 relative flex h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-accent">
                  Sample
                </p>
                <h3 className="font-serif text-lg text-foreground">{bookTitle}</h3>
              </div>
              <button
                ref={closeReveal.ref}
                onMouseMove={closeReveal.onMouseMove}
                type="button"
                onClick={handleClose}
                className="glass reveal elevation-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-shadow hover:elevation-2 hover:text-foreground"
                aria-label="Close sample"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div
              className="relative flex-1 overflow-y-auto bg-card px-8 py-8 sm:px-12"
              style={{ perspective: 1600 }}
            >
              {pages === null ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2
                    className="h-6 w-6 animate-spin text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              ) : (
                <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                  <motion.div
                    key={index}
                    custom={direction}
                    variants={prefersReducedMotion ? undefined : pageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
                    className="whitespace-pre-line font-serif text-base leading-relaxed text-foreground"
                  >
                    {pages[index]}

                    {isLast && (
                      <div className="mt-10 flex flex-col items-center gap-3 border-t border-border pt-8 text-center">
                        <p className="text-sm text-muted-foreground">
                          End of sample. Continue reading <em>{bookTitle}</em>:
                        </p>
                        <MarketLinks links={links} />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-border px-6 py-4">
              <motion.button
                ref={prevReveal.ref}
                onMouseMove={prevReveal.onMouseMove}
                type="button"
                onClick={() => goTo(index - 1)}
                disabled={isFirst}
                aria-label="Previous page"
                whileHover={isFirst ? undefined : { scale: 1.08, x: -2 }}
                whileTap={isFirst ? undefined : { scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="glass reveal elevation-1 flex h-9 w-9 items-center justify-center rounded-full transition-shadow hover:elevation-2 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </motion.button>

              <p className="text-sm text-muted-foreground">
                {pages === null ? "Loading…" : `Page ${index + 1} of ${total}`}
              </p>

              <motion.button
                ref={nextReveal.ref}
                onMouseMove={nextReveal.onMouseMove}
                type="button"
                onClick={() => goTo(index + 1)}
                disabled={isLast}
                aria-label="Next page"
                whileHover={isLast ? undefined : { scale: 1.08, x: 2 }}
                whileTap={isLast ? undefined : { scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="glass reveal elevation-1 flex h-9 w-9 items-center justify-center rounded-full transition-shadow hover:elevation-2 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
