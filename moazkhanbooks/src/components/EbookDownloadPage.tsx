import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Loader2, FileDown } from "lucide-react";
import { getDownloadUrl, getOrderStatus, type OrderStatus } from "@/lib/ebookApi";

const POLL_INTERVAL_MS = 2000;
const MAX_POLLS = 15;

const FORMAT_LABELS: Record<string, string> = { epub: "EPUB", pdf: "PDF" };

export default function EbookDownloadPage({ token }: { token: string }) {
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      try {
        const result = await getOrderStatus(token);
        if (cancelled) return;
        setOrder(result);
        attempts += 1;
        if (result.status === "pending" && attempts < MAX_POLLS) {
          setTimeout(poll, POLL_INTERVAL_MS);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleDownload = async (format: "epub" | "pdf") => {
    setDownloadingFormat(format);
    try {
      const url = await getDownloadUrl(token, format);
      window.location.href = url;
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      {notFound ? (
        <>
          <p className="font-serif text-xl text-foreground">Order not found</p>
          <p className="text-sm text-muted-foreground">
            That download link doesn't look right. Check your email for the correct link, or
            contact us if you believe this is a mistake.
          </p>
        </>
      ) : !order || order.status === "pending" ? (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-accent" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Confirming your payment&hellip;</p>
        </>
      ) : order.status === "failed" ? (
        <>
          <p className="font-serif text-xl text-foreground">Payment didn't go through</p>
          <p className="text-sm text-muted-foreground">
            No charge was made. Please try purchasing again.
          </p>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass elevation-2 flex flex-col items-center gap-4 rounded-2xl px-8 py-10"
        >
          <CheckCircle2 className="h-10 w-10 text-accent" aria-hidden="true" />
          <div>
            <p className="font-serif text-xl text-foreground">Thank you!</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your copy of <em>{order.bookTitle}</em> is ready.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {order.formats.map((format) => (
              <button
                key={format}
                type="button"
                onClick={() => handleDownload(format)}
                disabled={downloadingFormat === format}
                className="glass reveal elevation-1 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-foreground transition-shadow hover:elevation-2 disabled:opacity-60"
              >
                {downloadingFormat === format ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                Download {FORMAT_LABELS[format] ?? format}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            This link works any time you need it — bookmark or save the email for later.
          </p>
        </motion.div>
      )}
    </div>
  );
}
