import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import { mapDbToFrontend } from '@/utils/mappers'
import { calculateOverallScore } from '@/utils/scores'

function deriveStatus(team: any): string {
  const profile = mapDbToFrontend(team)
  if (!profile) return 'new'
  const { overall } = calculateOverallScore(profile)
  
  if (overall >= 4 && team.detected_stage) return 'finalized'
  if (overall >= 2) return 'completed'
  if (overall > 0) return 'in_progress'
  return 'new'
}

export async function GET() {
  const user = await getUserFromRequest()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createServerSupabaseClient()

  // 1. Fetch user role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role

  // 2. Fetch teams with role-aware logic
  let query = supabase.from('teams').select('*')

  if (role === 'startup') {
    // Startup sees their own (created or assigned)
    query = query.or(`user_id.eq.${user.id},startup_user_id.eq.${user.id}`)
  } else if (role === 'programme_team' || role === 'admin') {
    // Admins and Programme Team see everything for the summary
    // (No filter)
  } else {
    // Fallback security filter
    query = query.eq('user_id', user.id)
  }

  const { data: teams, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const statuses = (teams ?? []).map(deriveStatus)
  return NextResponse.json({
    total:       teams?.length ?? 0,
    in_progress: statuses.filter(s => s === 'in_progress').length,
    completed:   statuses.filter(s => s === 'completed').length,
    finalized:   statuses.filter(s => s === 'finalized').length,
    new:         statuses.filter(s => s === 'new').length,
  })
}
