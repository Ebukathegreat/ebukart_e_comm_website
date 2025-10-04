import { createClient } from "@supabase/supabase-js";

// ⚠️ Uses service role key (never expose to browser!)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // service role key, not anon
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
