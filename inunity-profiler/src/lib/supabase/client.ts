import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Singleton for use in hooks and client components
let client: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowser() {
  if (!client) client = createClient()
  return client
}
