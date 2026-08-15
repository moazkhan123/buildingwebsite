import { useState } from "react";
import { motion } from "motion/react";
import { Download, Loader2 } from "lucide-react";
import { useReveal } from "@/lib/useReveal";
import { startEbookCheckout } from "@/lib/ebookApi";
import StripeSecuredBadge from "@/components/StripeSecuredBadge";
import PaymentMethodsBanner from "@/components/PaymentMethodsBanner";
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
    <div className="mt-2 flex flex-col items-center gap-2">
      <motion.button
        ref={reveal.ref}
        onMouseMove={reveal.onMouseMove}
        type="button"
        onClick={handleClick}
        disabled={loading}
        animate={
          loading
            ? undefined
            : { boxShadow: ["var(--elevation-2)", "var(--elevation-4)", "var(--elevation-2)"] }
        }
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={loading ? undefined : { scale: 1.06 }}
        whileTap={loading ? undefined : { scale: 0.95 }}
        className="reveal group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-accent px-8 py-4 text-base font-semibold text-accent-foreground transition-colors duration-200 disabled:opacity-60"
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        ) : (
          <Download className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5" aria-hidden="true" />
        )}
        Buy Ebook — {formatPrice(ebook.priceCents, ebook.currency)}
      </motion.button>
      {error && (
        <p className="text-xs text-red-600">Something went wrong. Please try again.</p>
      )}
      <StripeSecuredBadge />
      <PaymentMethodsBanner />
      <a
        href="/#refund-policy"
        className="text-xs text-muted-foreground underline decoration-dotted underline-offset-2 hover:text-foreground"
      >
        Ebooks are non-refundable once downloaded
      </a>
    </div>
  );
}
