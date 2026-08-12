import Stripe from "npm:stripe@17";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import catalog from "../_shared/ebookCatalog.json" with { type: "json" };

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
});

const SITE_URL = Deno.env.get("SITE_URL") ?? "https://moazkhanbooks.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookSlug, email } = await req.json();
    const book = catalog.books.find((b: { slug: string }) => b.slug === bookSlug);

    if (!book) {
      return new Response(JSON.stringify({ error: "Unknown book" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = supabaseAdmin();

    // Create the order first so we have a stable id/download_token to hand
    // Stripe as metadata, and to use in the success_url before payment
    // actually completes.
    const { data: order, error: insertError } = await supabase
      .from("ebook_orders")
      .insert({
        book_slug: book.slug,
        email: email || null,
        stripe_session_id: crypto.randomUUID(), // placeholder, replaced below
        amount_cents: book.priceCents,
        currency: book.currency ?? "usd",
      })
      .select()
      .single();

    if (insertError || !order) {
      throw insertError ?? new Error("Failed to create order");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: book.currency ?? "usd",
            unit_amount: book.priceCents,
            product_data: { name: `${book.title} (ebook)` },
          },
          quantity: 1,
        },
      ],
      customer_email: email || undefined,
      success_url: `${SITE_URL}/?download=${order.download_token}`,
      cancel_url: `${SITE_URL}/`,
      metadata: { order_id: order.id, book_slug: book.slug },
      allow_promotion_codes: true,
    });

    // Now that we have the real Stripe session id, store it on the order.
    await supabase
      .from("ebook_orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Checkout failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
