import { createServerSupabaseClient } from './server'

export async function getUserFromRequest() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}
