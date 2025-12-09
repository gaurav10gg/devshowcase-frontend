import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,        // ⭐ Saves session in localStorage
      detectSessionInUrl: true,    // ⭐ Reads the #access_token from URL
      autoRefreshToken: true,      // ⭐ Refreshes token automatically
    },
  }
);
