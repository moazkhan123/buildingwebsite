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
}

export const ebooks: EbookProduct[] = [];

export function findEbook(title: string): EbookProduct | undefined {
  return ebooks.find((b) => b.title === title);
}
