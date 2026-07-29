import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import StarRating from "@/components/StarRating";
import { useReveal } from "@/lib/useReveal";
import type { Review } from "@/data/books";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/meeypqpq";

interface ReviewModalProps {
  bookTitle: string;
  reviews?: Review[];
  open: boolean;
  onClose: () => void;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function ReviewModal({ bookTitle, reviews, open, onClose }: ReviewModalProps) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const submitReveal = useReveal<HTMLButtonElement>();
  const closeReveal = useReveal<HTMLButtonElement>();

  const reset = () => {
    setName("");
    setRating(0);
    setComment("");
    setStatus("idle");
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;

    setStatus("submitting");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ book: bookTitle, name: name.trim() || "Anonymous", rating, comment }),
      });
      if (!res.ok) throw new Error("submission failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
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
            className="glass elevation-4 relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl p-6"
          >
            <button
              ref={closeReveal.ref}
              onMouseMove={closeReveal.onMouseMove}
              type="button"
              onClick={handleClose}
              className="glass reveal elevation-1 absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-shadow hover:elevation-2 hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {status === "success" ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle2 className="h-10 w-10 text-accent" />
                <p className="font-serif text-lg text-foreground">Thank you!</p>
                <p className="text-sm text-muted-foreground">
                  Your review of <em>{bookTitle}</em> has been sent.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <h3 className="font-serif text-lg text-foreground">Write a review</h3>
                  <p className="text-sm text-muted-foreground">{bookTitle}</p>
                </div>

                {reviews && reviews.length > 0 && (
                  <div className="flex flex-col gap-3 border-b border-border pb-4">
                    {reviews.map((r, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <StarRating value={r.rating} size={14} />
                          <span className="text-sm font-medium text-foreground">{r.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Rating</label>
                  <StarRating value={rating} onChange={setRating} size={24} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="review-name" className="text-sm font-medium text-foreground">
                    Name (optional)
                  </label>
                  <input
                    id="review-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-shadow focus:elevation-1 focus:ring-2 focus:ring-accent"
                    placeholder="Your name"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="review-comment" className="text-sm font-medium text-foreground">
                    Review
                  </label>
                  <textarea
                    id="review-comment"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-shadow focus:elevation-1 focus:ring-2 focus:ring-accent"
                    placeholder="What did you think?"
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-600">
                    Something went wrong sending your review. Please try again.
                  </p>
                )}

                <motion.button
                  ref={submitReveal.ref}
                  onMouseMove={submitReveal.onMouseMove}
                  type="submit"
                  disabled={status === "submitting" || rating === 0 || !comment.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="reveal elevation-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-shadow hover:elevation-3 disabled:opacity-50"
                >
                  {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
                  Submit review
                </motion.button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
