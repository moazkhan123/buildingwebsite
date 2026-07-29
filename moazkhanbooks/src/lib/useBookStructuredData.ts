import { useEffect } from "react";
import type { Book } from "@/data/books";

export function useBookStructuredData(books: Book[]) {
  useEffect(() => {
    const data = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: books.map((book, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Book",
          name: book.title,
          genre: book.genre,
          description: book.description,
          author: { "@type": "Person", name: "Moaz Khan" },
          ...(book.links?.us ? { url: book.links.us } : {}),
        },
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [books]);
}
