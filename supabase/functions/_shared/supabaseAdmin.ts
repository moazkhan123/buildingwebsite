import { createClient } from "jsr:@supabase/supabase-js@2";

// Service-role client: bypasses Row Level Security. Only ever used inside
// edge functions, never exposed to the browser.
export function supabaseAdmin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}
