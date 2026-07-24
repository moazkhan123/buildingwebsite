import { books } from "@/data/books";
import BookCard from "@/components/BookCard";
import { MapPin, ExternalLink } from "lucide-react";

const AMAZON_AUTHOR_URL = "https://www.amazon.com/author/moazkhan";

export default function App() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <header className="flex items-center justify-between py-8">
        <span className="font-serif text-lg tracking-tight">Moaz Khan</span>
        <nav className="flex gap-6 text-sm text-muted-foreground">
          <a href="#books" className="hover:text-foreground">
            Books
          </a>
          <a href="#about" className="hover:text-foreground">
            About
          </a>
          <a href="#contact" className="hover:text-foreground">
            Contact
          </a>
        </nav>
      </header>

      <section className="flex flex-col items-start gap-6 border-b border-border py-16 sm:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Author
        </p>
        <h1 className="max-w-2xl text-balance font-serif text-4xl leading-tight sm:text-6xl">
          Stories that live in morally complex worlds.
        </h1>
        <p className="max-w-xl text-balance text-lg leading-relaxed text-muted-foreground">
          Moaz Khan writes across genres — literary crime fiction, thrillers,
          and books for younger readers — drawing on a decade of experience as
          a manufacturing engineer in the automotive industry.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <a
            href="#books"
            className="inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90"
          >
            Explore the books
          </a>
          <a
            href={AMAZON_AUTHOR_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-card"
          >
            View on Amazon
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      <section id="books" className="border-b border-border py-16 sm:py-24">
        <h2 className="font-serif text-3xl">Books</h2>
        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.title} book={book} />
          ))}
        </div>
      </section>

      <section id="about" className="border-b border-border py-16 sm:py-24">
        <h2 className="font-serif text-3xl">About</h2>
        <div className="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            Moaz Khan writes across genres, from literary crime fiction to
            children's books to practical nonfiction, drawing on a decade of
            experience as a manufacturing engineer in the automotive industry.
          </p>
          <p>
            His fiction explores morally complex worlds and unconventional
            endings, including the literary crime thriller{" "}
            <em>The Godman</em>, the mystery <em>The Closing Number</em> set
            in Hong Kong, the Prague-set thriller <em>A Memory of Smell</em>,
            and the literary novel <em>Mirrored Falls</em>, published in both
            English and Hindustani Hindi editions. His middle-grade novel{" "}
            <em>The Girl Who Saw in the Dark</em> follows a girl with night
            blindness who builds a company from her greatest challenge.
          </p>
          <p>
            For younger readers, Moaz has written{" "}
            <em>Rich Habits, Young Minds</em>, a financial literacy book
            following one family through five money lessons; and{" "}
            <em>The Question Kids</em>, which introduces young readers to six
            real-world inventors.
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Mississauga, Ontario
          </p>
        </div>
      </section>

      <footer id="contact" className="flex flex-col gap-4 py-16 sm:py-24">
        <h2 className="font-serif text-3xl">Get in touch</h2>
        <p className="max-w-xl text-muted-foreground">
          For rights inquiries, review copies, or events, find the full
          catalog and author profile on Amazon.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <a
            href={AMAZON_AUTHOR_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-card"
          >
            Amazon Author Page
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <p className="pt-10 text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Moaz Khan
        </p>
      </footer>
    </div>
  );
}
