import { createServerSupabaseClient } from '@/lib/supabase/server'
import { UserProfile } from '@/types/auth'

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, status, avatar_url, startup_name, requested_cohort_id, cohort_id')
      .eq('id', user.id)
      .single()

    if (profile) return profile

    // DB lookup failed — fall back to JWT user_metadata so layouts don't
    // incorrectly redirect authenticated users back to /login
    if (error) {
      console.warn('[getUserProfile] DB lookup failed, using JWT metadata fallback:', error.message)
    }

    const metaRole = user.user_metadata?.role as string
    if (!metaRole) return null

    // Return a minimal profile from JWT — enough for role-based routing
    return {
      id: user.id,
      email: user.email ?? '',
      full_name: user.user_metadata?.full_name ?? '',
      startup_name: user.user_metadata?.startup_name,
      role: metaRole as any,
      // Non-startup roles are always approved; startup status defaults to pending
      status: (metaRole === 'startup' ? 'pending' : 'approved') as any,
    }
  } catch (err) {
    console.error('[getUserProfile] Unexpected error:', err)
    return null
  }
}
