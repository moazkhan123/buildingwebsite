import { motion } from "motion/react";
import { books } from "@/data/books";
import BookCarousel from "@/components/BookCarousel";
import AnimatedBackground from "@/components/AnimatedBackground";
import BookshelfBackground from "@/components/BookshelfBackground";
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
      <AnimatedBackground />

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Logo />
          <nav className="flex gap-4 text-sm text-muted-foreground sm:gap-6">
            <a
              href="#books"
              className="reveal relative rounded-full px-3 py-1.5 transition-colors after:absolute after:inset-x-3 after:-bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100"
            >
              Books
            </a>
            <a
              href="#about"
              className="reveal relative rounded-full px-3 py-1.5 transition-colors after:absolute after:inset-x-3 after:-bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100"
            >
              About
            </a>
            <a
              href="#contact"
              className="reveal relative rounded-full px-3 py-1.5 transition-colors after:absolute after:inset-x-3 after:-bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main>
      <section className="relative overflow-hidden border-b border-border">
        <BookshelfBackground />
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="relative mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-24 sm:py-32"
        >
          <motion.p
            variants={fadeUp}
            className="text-sm font-medium uppercase tracking-widest text-accent"
          >
            Author
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="max-w-2xl text-balance font-serif text-4xl leading-tight text-[#fbeee0] sm:text-6xl"
          >
            Stories that live in morally complex worlds.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="max-w-xl text-balance text-lg leading-relaxed text-[#fbeee0]/80"
          >
            Moaz Khan writes across genres, from literary crime fiction and
            thrillers to books for younger readers, drawing on a decade of
            experience as a manufacturing engineer in the automotive industry.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-2">
            <Button href="#books" variant="primary">
              Explore the books
            </Button>
            <Button
              href={AMAZON_AUTHOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              className="text-[#fbeee0]"
            >
              View on Amazon
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <div className="mx-auto max-w-5xl px-6">
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
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            Author
          </p>
          <h2 className="mt-2 font-serif text-3xl">About</h2>
          <div className="mt-6 max-w-2xl space-y-6 text-base leading-relaxed text-muted-foreground">
            <p>
              Moaz Khan writes across genres, from literary crime fiction and
              thrillers to children's books and practical nonfiction, drawing
              on a decade of experience as a manufacturing engineer in the
              automotive industry.
            </p>

            <div className="space-y-2">
              <h3 className="font-serif text-lg text-foreground">Fiction</h3>
              <p>
                His fiction explores morally complex worlds and unconventional
                endings: the literary crime thriller <em>The Godman</em>; the
                Hong Kong–set mystery <em>The Closing Number</em>; the
                Prague-set thriller <em>A Memory of Smell</em>; the literary
                novel <em>Mirrored Falls</em>, published in both English and
                Hindustani Hindi editions; the psychological novel{" "}
                <em>The Stress Experts</em>; and <em>Mercies</em>, a novel of
                magic, medicine, and faith in ancient Egypt.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-lg text-foreground">
                Children's books
              </h3>
              <p>
                For younger readers: <em>The Girl Who Saw in the Dark</em>, a
                middle-grade novel about a girl with night blindness who
                builds a company from her greatest challenge;{" "}
                <em>Rich Habits, Young Minds</em>, a financial literacy book
                following one family through five money lessons;{" "}
                <em>The Question Kids</em>, which introduces young readers to
                six real-world inventors; and <em>Math Is My Favorite</em>, a
                visual, household approach to mathematics for Standards 1
                through 8.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-lg text-foreground">Nonfiction</h3>
              <p>
                His nonfiction spans trades, technology, and personal growth:{" "}
                <em>The Trades AI Can't Touch</em> covers six industrial
                trades that automation can't replace; <em>AI Edge</em> is a
                day trader's playbook for using AI to manage risk;{" "}
                <em>From the Plant Floor</em> is a practical guide to robotic
                welding; <em>Why I Can't Leave Islam</em> explores his
                relationship with faith in 13 arguments; <em>Bullseye
                Confidence</em> and <em>The Confidence Prompt</em> both
                address performing under pressure; and{" "}
                <em>The Down Syndrome Parenting Companion</em> is a guide to
                raising a child with Down syndrome, age by age.
              </p>
            </div>

            <p className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Mississauga, Ontario
            </p>
          </div>
        </motion.section>

        <motion.footer
          id="contact"
          {...revealOnScroll(0.4)}
          className="flex flex-col gap-4 py-16 sm:py-24"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            Contact
          </p>
          <h2 className="font-serif text-3xl">Get in touch</h2>
          <p className="max-w-xl text-muted-foreground">
            For rights inquiries, review copies, or events, find the full
            catalog and author profile on Amazon.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button href={AMAZON_AUTHOR_URL} target="_blank" rel="noopener noreferrer" variant="secondary">
              Amazon Author Page
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </div>
          <p className="pt-10 text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Moaz Khan
          </p>
        </motion.footer>
      </div>
      </main>
    </>
  );
}
