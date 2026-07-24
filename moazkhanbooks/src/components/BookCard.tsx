import { useState } from "react";
import { motion } from "motion/react";
import BookCover from "@/components/BookCover";
import StarRating from "@/components/StarRating";
import ReviewModal from "@/components/ReviewModal";
import type { Book } from "@/data/books";
import { ExternalLink, MessageSquarePlus } from "lucide-react";

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function BookCard({ book }: { book: Book }) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const Wrapper = book.link ? motion.a : motion.div;
  const linkProps = book.link
    ? { href: book.link, target: "_blank", rel: "noreferrer" }
    : {};

  const reviews = book.reviews ?? [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <>
      <Wrapper
        {...linkProps}
        variants={item}
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group flex flex-col gap-4"
      >
        <BookCover title={book.title} color={book.coverColor} cover={book.cover} />
        <div>
          <h3 className="font-serif text-xl text-foreground">{book.title}</h3>
          <p className="mt-1 text-sm font-medium uppercase tracking-wide text-accent">
            {book.genre}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {book.description}
          </p>
          {book.link && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
              View on Amazon
              <ExternalLink className="h-3.5 w-3.5" />
            </p>
          )}

          <div className="mt-3 flex items-center gap-3">
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setReviewOpen(true);
              }}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition hover:opacity-80"
            >
              <MessageSquarePlus className="h-3.5 w-3.5" />
              Write a review
            </button>
          </div>
        </div>
      </Wrapper>

      <ReviewModal
        bookTitle={book.title}
        reviews={book.reviews}
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
      />
    </>
  );
}
