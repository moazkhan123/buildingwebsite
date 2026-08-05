import { useEffect } from "react";
import type { Book } from "@/data/books";

export function useBookStructuredData(books: Book[]) {
  useEffect(() => {
    const data = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: books.map((book, i) => {
        const marketLinks = [book.links?.us, book.links?.ca, book.links?.in].filter(
          (url): url is string => Boolean(url),
        );
        return {
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Book",
            name: book.title,
            genre: book.genre,
            description: book.description,
            inLanguage: "en",
            author: { "@type": "Person", name: "Moaz Khan" },
            ...(book.cover ? { image: new URL(book.cover, window.location.origin).href } : {}),
            ...(marketLinks[0] ? { url: marketLinks[0] } : {}),
            ...(marketLinks.length > 1 ? { sameAs: marketLinks.slice(1) } : {}),
          },
        };
      }),
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
