import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

const BUCKET = "ebooks";
const SIGNED_URL_TTL_SECONDS = 300;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const format = url.searchParams.get("format");

  if (!token || (format !== "epub" && format !== "pdf")) {
    return new Response(JSON.stringify({ error: "Missing token or format" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = supabaseAdmin();
  const { data: order } = await supabase
    .from("ebook_orders")
    .select("id, status, book_slug")
    .eq("download_token", token)
    .single();

  if (!order || order.status !== "paid") {
    return new Response(JSON.stringify({ error: "Not found or unpaid" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const path = `${order.book_slug}.${format}`;
  const { data: signed, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  if (error || !signed) {
    console.error("Failed to sign URL", error);
    return new Response(JSON.stringify({ error: "File unavailable" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  await supabase.from("ebook_download_events").insert({
    order_id: order.id,
    file_format: format,
    user_agent: req.headers.get("user-agent"),
  });

  return new Response(JSON.stringify({ url: signed.signedUrl }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
