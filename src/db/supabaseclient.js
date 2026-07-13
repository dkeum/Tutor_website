
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      detectSessionInUrl: true, // picks up the session after Google redirects back
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)
