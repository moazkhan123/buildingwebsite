import { motion } from "motion/react";
import { books } from "@/data/books";
import BookCarousel from "@/components/BookCarousel";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import { useBookStructuredData } from "@/lib/useBookStructuredData";
import { MapPin, ExternalLink } from "lucide-react";

const AMAZON_AUTHOR_URL = "https://www.amazon.com/author/moazkhan";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

function revealOnScroll(amount: number) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount },
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  } as const;
}

export default function App() {
  useBookStructuredData(books);

  return (
    <>
      <ScrollProgressBar />

      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Logo />
          <nav className="flex gap-6 text-sm text-muted-foreground sm:gap-8">
            <a href="#books" className="transition-colors hover:text-foreground">
              Books
            </a>
            <a href="#about" className="transition-colors hover:text-foreground">
              About
            </a>
            <a href="#contact" className="transition-colors hover:text-foreground">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6">
        <motion.section
          initial="hidden"
          animate="show"
          variants={stagger}
          className="flex flex-col items-start gap-6 border-b border-border py-24 sm:py-32"
        >
          <motion.p
            variants={fadeUp}
            className="text-sm font-medium uppercase tracking-widest text-accent"
          >
            Author
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="max-w-2xl text-balance font-serif text-4xl leading-tight text-foreground sm:text-6xl"
          >
            Stories that live in morally complex worlds.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="max-w-xl text-balance text-lg leading-relaxed text-muted-foreground"
          >
            Moaz Khan writes across genres — literary crime fiction, thrillers,
            and books for younger readers — drawing on a decade of experience as
            a manufacturing engineer in the automotive industry.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-2">
            <Button href="#books" variant="primary">
              Explore the books
            </Button>
            <Button href={AMAZON_AUTHOR_URL} target="_blank" rel="noopener noreferrer" variant="secondary">
              View on Amazon
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        </motion.section>

        <section id="books" className="border-b border-border py-16 sm:py-24">
          <motion.h2 {...revealOnScroll(0.4)} className="font-serif text-3xl">
            Books
          </motion.h2>
          <div className="mt-10">
            <BookCarousel books={books} />
          </div>
        </section>

        <motion.section
          id="about"
          {...revealOnScroll(0.2)}
          className="border-b border-border py-16 sm:py-24"
        >
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
            <p>
              His nonfiction spans trades and technology, too:{" "}
              <em>The Trades AI Can't Touch</em> covers six industrial trades
              that automation can't replace, <em>AI Edge</em> is a day
              trader's playbook for using AI to manage risk, and{" "}
              <em>From the Plant Floor</em> is a practical guide to robotic
              welding. <em>Why I Can't Leave Islam</em> rounds out the
              catalog with 13 arguments on faith.
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              Mississauga, Ontario
            </p>
          </div>
        </motion.section>

        <motion.footer
          id="contact"
          {...revealOnScroll(0.4)}
          className="flex flex-col gap-4 py-16 sm:py-24"
        >
          <h2 className="font-serif text-3xl">Get in touch</h2>
          <p className="max-w-xl text-muted-foreground">
            For rights inquiries, review copies, or events, find the full
            catalog and author profile on Amazon.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button href={AMAZON_AUTHOR_URL} target="_blank" rel="noopener noreferrer" variant="secondary">
              Amazon Author Page
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="pt-10 text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Moaz Khan
          </p>
        </motion.footer>
      </div>
    </>
  );
}
