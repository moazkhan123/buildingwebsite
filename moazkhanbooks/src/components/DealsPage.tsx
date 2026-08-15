import { motion } from "motion/react";
import { Tag, ArrowLeft } from "lucide-react";
import { books } from "@/data/books";
import { ebooks } from "@/data/ebooks";
import BuyEbookButton from "@/components/BuyEbookButton";

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export default function DealsPage() {
  const deals = ebooks
    .filter((e) => e.amazonPriceCents && e.amazonPriceCents > e.priceCents)
    .map((e) => ({
      ebook: e,
      cover: books.find((b) => b.title === e.title)?.cover,
      savingsPct: Math.round(
        ((e.amazonPriceCents! - e.priceCents) / e.amazonPriceCents!) * 100,
      ),
    }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <a
        href="/"
        className="reveal relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to books
      </a>

      <div className="mt-6 flex items-center gap-2">
        <Tag className="h-5 w-5 text-accent" aria-hidden="true" />
        <h1 className="font-serif text-3xl text-foreground">Deals</h1>
      </div>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Ebooks priced lower here than their current Amazon list price — buy direct and save.
      </p>

      {deals.length === 0 ? (
        <p className="mt-12 text-muted-foreground">
          No deals right now — check back soon.
        </p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {deals.map(({ ebook, cover, savingsPct }) => (
            <motion.div
              key={ebook.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass elevation-2 flex flex-col items-center gap-3 rounded-2xl px-6 py-8 text-center"
            >
              {cover && (
                <img
                  src={cover}
                  alt={ebook.title}
                  className="h-40 w-auto rounded-md object-cover elevation-1"
                />
              )}
              <h2 className="font-serif text-xl text-foreground">{ebook.title}</h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground line-through">
                  {formatPrice(ebook.amazonPriceCents!, ebook.currency)}
                </span>
                <span className="font-semibold text-accent">
                  {formatPrice(ebook.priceCents, ebook.currency)}
                </span>
                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
                  Save {savingsPct}%
                </span>
              </div>
              <BuyEbookButton ebook={ebook} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
