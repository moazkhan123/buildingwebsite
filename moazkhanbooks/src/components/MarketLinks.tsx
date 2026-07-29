import type { MarketLinks as MarketLinksData } from "@/data/books";

const MARKETS: { key: keyof MarketLinksData; label: string; flag: string }[] = [
  { key: "us", label: "United States", flag: "🇺🇸" },
  { key: "ca", label: "Canada", flag: "🇨🇦" },
  { key: "in", label: "India", flag: "🇮🇳" },
];

export default function MarketLinks({ links }: { links?: MarketLinksData }) {
  const available = MARKETS.filter((m) => links?.[m.key]);
  if (available.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-2 pt-1">
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Amazon
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {available.map((m) => (
          <a
            key={m.key}
            href={links![m.key]}
            target="_blank"
            rel="noreferrer"
            aria-label={`View on Amazon ${m.label}`}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-background"
          >
            <span aria-hidden="true">{m.flag}</span>
            {m.label}
          </a>
        ))}
      </div>
    </div>
  );
}
