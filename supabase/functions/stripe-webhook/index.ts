import Stripe from "npm:stripe@17";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import catalog from "../_shared/ebookCatalog.json" with { type: "json" };

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
});
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const fromEmail = Deno.env.get("EMAIL_FROM") ?? "orders@moazkhanbooks.com";
const SITE_URL = Deno.env.get("SITE_URL") ?? "https://moazkhanbooks.com";

async function sendDownloadEmail(to: string, bookTitle: string, token: string) {
  if (!resendApiKey) {
    console.error("RESEND_API_KEY not set; skipping download email");
    return;
  }
  const link = `${SITE_URL}/?download=${token}`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to,
      subject: `Your download: ${bookTitle}`,
      html: `
        <p>Thank you for buying <strong>${bookTitle}</strong>.</p>
        <p><a href="${link}">Click here to download your ebook</a>.</p>
        <p>This link works any time you need it &mdash; keep it for future downloads.</p>
      `,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("Resend send failed", res.status, body);
  }
}

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature!, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    const bookSlug = session.metadata?.book_slug;
    if (!orderId) {
      console.error("Missing order_id in session metadata", session.id);
      return new Response("ok", { status: 200 });
    }

    const supabase = supabaseAdmin();
    const { data: existing } = await supabase
      .from("ebook_orders")
      .select("status, download_token, email")
      .eq("id", orderId)
      .single();

    // Idempotent: Stripe may retry this webhook.
    if (existing && existing.status !== "paid") {
      const email = session.customer_details?.email ?? existing.email;
      await supabase
        .from("ebook_orders")
        .update({ status: "paid", paid_at: new Date().toISOString(), email })
        .eq("id", orderId);

      const book = catalog.books.find((b: { slug: string }) => b.slug === bookSlug);
      if (email && book && existing.download_token) {
        await sendDownloadEmail(email, book.title, existing.download_token);
      }
    }
  }

  return new Response("ok", { status: 200 });
});
