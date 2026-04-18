import { createClient } from '@supabase/supabase-js'

// IMPORTANT: This client uses the service role key and bypasses Row Level Security.
// ONLY use this in secure, server-side API routes where you explicitly need to bypass operations
// that the requesting user might not have permissions for (e.g. system background updates).
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
