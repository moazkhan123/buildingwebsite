import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import StarRating from "@/components/StarRating";
import ReviewModal from "@/components/ReviewModal";
import Button from "@/components/Button";
import type { Book } from "@/data/books";
import { ExternalLink, MessageSquarePlus } from "lucide-react";

export default function BookDetailPanel({ book }: { book: Book }) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const reviews = book.reviews ?? [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={book.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="glass elevation-2 mx-auto flex max-w-lg flex-col items-center gap-3 rounded-2xl px-8 py-8 text-center"
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
              <MessageSquarePlus className="h-3.5 w-3.5" />
              Write a review
            </button>
          </div>

          {book.link && (
            <Button href={book.link} target="_blank" rel="noreferrer" variant="primary" className="mt-2">
              View on Amazon
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          )}
        </motion.div>
      </AnimatePresence>

      <ReviewModal
        bookTitle={book.title}
        reviews={book.reviews}
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
      />
    </>
  );
}
