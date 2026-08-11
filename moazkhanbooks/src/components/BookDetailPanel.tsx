import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import StarRating from "@/components/StarRating";
import ReviewModal from "@/components/ReviewModal";
import SampleReader from "@/components/SampleReader";
import BuyEbookButton from "@/components/BuyEbookButton";
import MarketLinks from "@/components/MarketLinks";
import Button from "@/components/Button";
import { useReveal } from "@/lib/useReveal";
import { sampleLoaders } from "@/data/sampleLoaders";
import { findEbook } from "@/data/ebooks";
import type { Book } from "@/data/books";
import { MessageSquarePlus, BookOpen } from "lucide-react";

export default function BookDetailPanel({ book }: { book: Book }) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [sampleOpen, setSampleOpen] = useState(false);
  const sampleReveal = useReveal<HTMLButtonElement>();
  const reviews = book.reviews ?? [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  const sampleLink = book.links?.us ?? book.links?.ca ?? book.links?.in;
  const loadSample = sampleLoaders[book.title];
  const ebook = findEbook(book.title);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={book.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="glass elevation-2 mx-auto flex max-w-lg flex-col items-center gap-3 rounded-2xl px-8 py-8 text-center transition-shadow duration-300 hover:elevation-3"
        >
          <h3 className="font-serif text-2xl text-foreground">{book.title}</h3>
          <p className="text-sm font-medium uppercase tracking-wide text-accent">
            {book.genre}
          </p>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {book.description}
          </p>

          <div className="flex items-center gap-3 pt-1">
            {reviews.length > 0 ? (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <StarRating value={Math.round(averageRating)} size={14} />
                <span>({reviews.length})</span>
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">No reviews yet</span>
            )}
            <button
              type="button"
              onClick={() => setReviewOpen(true)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition hover:opacity-80"
            >
              <MessageSquarePlus className="h-3.5 w-3.5" aria-hidden="true" />
              Write a review
            </button>
          </div>

          {loadSample ? (
            <motion.button
              ref={sampleReveal.ref}
              onMouseMove={sampleReveal.onMouseMove}
              type="button"
              onClick={() => setSampleOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
              className="glass reveal elevation-1 mt-1 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-foreground transition-shadow duration-200 hover:elevation-2"
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              Read Sample
            </motion.button>
          ) : (
            sampleLink && (
              <Button
                href={sampleLink}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                className="mt-1"
              >
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                Read a sample on Amazon
              </Button>
            )
          )}

          {ebook && <BuyEbookButton ebook={ebook} />}

          <MarketLinks links={book.links} />
        </motion.div>
      </AnimatePresence>

      <ReviewModal
        bookTitle={book.title}
        reviews={book.reviews}
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
      />

      {loadSample && (
        <SampleReader
          bookTitle={book.title}
          loadPages={loadSample}
          open={sampleOpen}
          onClose={() => setSampleOpen(false)}
          links={book.links}
        />
      )}
    </>
  );
}
