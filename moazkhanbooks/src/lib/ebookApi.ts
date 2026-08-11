const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL as string | undefined;

function requireBaseUrl() {
  if (!FUNCTIONS_URL) {
    throw new Error("VITE_SUPABASE_FUNCTIONS_URL is not configured");
  }
  return FUNCTIONS_URL;
}

export async function startEbookCheckout(bookSlug: string, email?: string) {
  const res = await fetch(`${requireBaseUrl()}/create-checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookSlug, email }),
  });
  if (!res.ok) throw new Error("Checkout failed");
  const { url } = (await res.json()) as { url: string };
  return url;
}

export interface OrderStatus {
  status: "pending" | "paid" | "failed";
  bookTitle: string;
  formats: ("epub" | "pdf")[];
}

export async function getOrderStatus(token: string): Promise<OrderStatus> {
  const res = await fetch(`${requireBaseUrl()}/get-order?token=${encodeURIComponent(token)}`);
  if (!res.ok) throw new Error("Order not found");
  return res.json();
}

export async function getDownloadUrl(token: string, format: "epub" | "pdf") {
  const res = await fetch(
    `${requireBaseUrl()}/download?token=${encodeURIComponent(token)}&format=${format}`,
  );
  if (!res.ok) throw new Error("Download unavailable");
  const { url } = (await res.json()) as { url: string };
  return url;
}
