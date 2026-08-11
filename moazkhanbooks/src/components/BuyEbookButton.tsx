import { useState } from "react";
import { motion } from "motion/react";
import { Download, Loader2 } from "lucide-react";
import { useReveal } from "@/lib/useReveal";
import { startEbookCheckout } from "@/lib/ebookApi";
import StripeSecuredBadge from "@/components/StripeSecuredBadge";
import type { EbookProduct } from "@/data/ebooks";

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export default function BuyEbookButton({ ebook }: { ebook: EbookProduct }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const reveal = useReveal<HTMLButtonElement>();

  const handleClick = async () => {
    setError(false);
    setLoading(true);
    try {
      const url = await startEbookCheckout(ebook.slug);
      window.location.href = url;
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="mt-1 flex flex-col items-center gap-1.5">
      <motion.button
        ref={reveal.ref}
        onMouseMove={reveal.onMouseMove}
        type="button"
        onClick={handleClick}
        disabled={loading}
        whileHover={loading ? undefined : { scale: 1.03 }}
        whileTap={loading ? undefined : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
        className="reveal elevation-2 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-shadow duration-200 hover:elevation-3 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        Buy Ebook — {formatPrice(ebook.priceCents, ebook.currency)}
      </motion.button>
      {error && (
        <p className="text-xs text-red-600">Something went wrong. Please try again.</p>
      )}
      <StripeSecuredBadge />
    </div>
  );
}
