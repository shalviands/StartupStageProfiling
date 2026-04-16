import { createServerSupabaseClient } from '@/lib/supabase/server'

export type UserRole = 'startup' | 'programme_team' | 'admin'
export type UserStatus = 'pending' | 'approved' | 'rejected'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: UserRole
  status: UserStatus
}

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

export function getHomeRouteForRole(
  role: UserRole,
  status: UserStatus
): string {
  if (role === 'admin') return '/admin/dashboard'
  if (role === 'programme_team') return '/profiler'
  
  // startup
  if (status === 'pending') return '/pending'
  if (status === 'rejected') return '/login?error=rejected'
  return '/startup/profile'
}
