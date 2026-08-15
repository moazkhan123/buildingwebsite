// Ebook catalog: which books are sold as direct downloads, and at what
// price. Must be kept in sync with supabase/functions/_shared/ebookCatalog.json
// (that copy is what the backend actually trusts for pricing — this one is
// only used to decide which "Buy Ebook" buttons to show and their price
// display).
export interface EbookProduct {
  slug: string;
  title: string;
  priceCents: number;
  currency: string;
  formats: ("epub" | "pdf")[];
  // Optional: the book's current Amazon list price in cents, for the same
  // currency. Set this to make the book eligible for the Deals page — it
  // only shows up there when priceCents is actually lower than this.
  amazonPriceCents?: number;
}

export const ebooks: EbookProduct[] = [
  {
    slug: "the-godman",
    title: "The Godman",
    priceCents: 2099,
    currency: "usd",
    formats: ["epub"],
    amazonPriceCents: 2499,
  },
  {
    slug: "lavender",
    title: "Lavender",
    priceCents: 399,
    currency: "usd",
    formats: ["epub"],
    amazonPriceCents: 499,
  },
  {
    slug: "habits-misunderstood",
    title: "Habits, Misunderstood",
    priceCents: 399,
    currency: "usd",
    formats: ["epub"],
    amazonPriceCents: 499,
  },
];

export function findEbook(title: string): EbookProduct | undefined {
  return ebooks.find((b) => b.title === title);
}
