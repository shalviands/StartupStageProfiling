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
  const { data: teams, error } = await supabase
    .from('teams')
    .select('*')
    .eq('user_id', user.id)

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
