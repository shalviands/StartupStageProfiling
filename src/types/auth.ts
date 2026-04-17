export type UserRole = 'startup' | 'programme_team' | 'admin'
export type UserStatus = 'pending' | 'approved' | 'rejected'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: UserRole
  status: UserStatus
  avatar_url?: string
  startup_name?: string
}
