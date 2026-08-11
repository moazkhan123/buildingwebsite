import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import catalog from "../_shared/ebookCatalog.json" with { type: "json" };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return new Response(JSON.stringify({ error: "Missing token" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = supabaseAdmin();
  const { data: order } = await supabase
    .from("ebook_orders")
    .select("status, book_slug")
    .eq("download_token", token)
    .single();

  if (!order) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const book = catalog.books.find((b: { slug: string }) => b.slug === order.book_slug);

  return new Response(
    JSON.stringify({
      status: order.status,
      bookTitle: book?.title ?? order.book_slug,
      formats: book?.formats ?? [],
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
