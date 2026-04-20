import { createServerSupabaseClient } from '@/lib/supabase/server'
import { UserProfile } from '@/types/auth'

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, status, avatar_url, startup_name, requested_cohort_id, cohort_id')
      .eq('id', user.id)
      .single()

    return profile ?? null
  } catch {
    return null
  }
}
