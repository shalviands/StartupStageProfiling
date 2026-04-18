import { UserRole, UserStatus } from '@/types/auth'

export function getHomeRouteForRole(
  role: UserRole,
  status: UserStatus
): string {
  if (role === 'admin') return '/admin/dashboard'
  if (role === 'programme_team') return '/programme/dashboard'
  
  // startup
  if (status === 'pending') return '/pending'
  if (status === 'rejected') return '/login?error=rejected'
  return '/startup'
}
