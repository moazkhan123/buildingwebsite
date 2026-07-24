import BookCover from "@/components/BookCover";
import type { Book } from "@/data/books";

export default function BookCard({ book }: { book: Book }) {
  return (
    <div className="flex flex-col gap-4">
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
    </div>
  );
}
