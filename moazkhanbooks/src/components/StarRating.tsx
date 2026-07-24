import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}

export default function StarRating({ value, onChange, size = 20 }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const interactive = Boolean(onChange);
  const shown = hovered ?? value;

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={() => setHovered(null)}
      role={interactive ? "radiogroup" : undefined}
      aria-label={interactive ? "Rating" : `Rated ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => interactive && setHovered(n)}
          className={cn(
            "transition-transform",
            interactive && "cursor-pointer hover:scale-110"
          )}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            size={size}
            className={cn(
              n <= shown ? "fill-accent text-accent" : "fill-none text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
}
