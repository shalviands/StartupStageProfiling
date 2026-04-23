import { createServerSupabaseClient } from '@/lib/supabase/server'
import { UserProfile } from '@/types/auth'

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return profile ?? null
  } catch {
    return null
  }
}
