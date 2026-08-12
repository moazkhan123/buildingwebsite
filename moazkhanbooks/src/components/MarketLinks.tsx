import type { MarketLinks as MarketLinksData } from "@/data/books";
import AmazonIcon from "@/components/AmazonIcon";

const MARKETS: { key: keyof MarketLinksData; label: string; flag: string }[] = [
  { key: "us", label: "United States", flag: "🇺🇸" },
  { key: "ca", label: "Canada", flag: "🇨🇦" },
  { key: "in", label: "India", flag: "🇮🇳" },
];

export default function MarketLinks({ links }: { links?: MarketLinksData }) {
  const available = MARKETS.flatMap((m) => {
    const href = links?.[m.key];
    return href ? [{ ...m, href }] : [];
  });
  if (available.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-2 pt-1">
      <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        <AmazonIcon className="h-3.5 w-3.5" />
        Also available on Amazon
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {available.map((m) => (
          <a
            key={m.key}
            href={m.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View on Amazon ${m.label}`}
            className="glass reveal elevation-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-foreground transition-shadow hover:elevation-2"
          >
            <span aria-hidden="true">{m.flag}</span>
            {m.label}
          </a>
        ))}
      </div>
    </div>
  );
}
