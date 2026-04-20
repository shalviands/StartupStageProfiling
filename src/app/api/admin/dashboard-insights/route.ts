import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import { runDashboardInsights } from '@/lib/ai/openrouter'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { calculateOverallScore } from '@/utils/scores'

export async function POST(
  _req: NextRequest
) {
  const user = await getUserFromRequest()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createServerSupabaseClient()
  
  // 1. Verify Admin Role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'programme_team') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 2. Fetch all teams for cohort analysis (bypass RLS)
  const { data: teams, error } = await supabaseAdmin.from('teams').select('*')
  if (error || !teams) return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })

  // 3. Aggregate Cohort Stats for the AI
  const total = teams.length
  const idea_count = teams.filter(t => t.detected_stage?.includes('IDEA')).length
  const psf_count = teams.filter(t => t.detected_stage?.includes('PSF')).length
  const validation_count = teams.filter(t => t.detected_stage?.includes('VALIDATION')).length
  const mvp_count = teams.filter(t => t.detected_stage?.includes('MVP')).length
  const revenue_count = teams.filter(t => t.detected_stage?.includes('REVENUE')).length
  const growth_count = teams.filter(t => t.detected_stage?.includes('GROWTH')).length

  const scores = teams.map(t => calculateOverallScore(t))
  const avgOverall = scores.length > 0 ? (scores.reduce((a, b) => a + b.overall, 0) / scores.length).toFixed(1) : '0.0'
  
  const sectors = Array.from(new Set(teams.map(t => t.sector).filter(Boolean)))

  const cohortStats = {
    total,
    idea_count,
    psf_count,
    validation_count,
    mvp_count,
    revenue_count,
    growth_count,
    avg_overall: avgOverall,
    avg_p1: (scores.reduce((a, b) => a + b.averages.p1, 0) / scores.length).toFixed(1),
    avg_p2: (scores.reduce((a, b) => a + b.averages.p2, 0) / scores.length).toFixed(1),
    avg_p3: (scores.reduce((a, b) => a + b.averages.p3, 0) / scores.length).toFixed(1),
    avg_p4: (scores.reduce((a, b) => a + b.averages.p4, 0) / scores.length).toFixed(1),
    avg_p5: (scores.reduce((a, b) => a + b.averages.p5, 0) / scores.length).toFixed(1),
    avg_p6: (scores.reduce((a, b) => a + b.averages.p6, 0) / scores.length).toFixed(1),
    avg_p7: (scores.reduce((a, b) => a + b.averages.p7, 0) / scores.length).toFixed(1),
    avg_p8: (scores.reduce((a, b) => a + b.averages.p8, 0) / scores.length).toFixed(1),
    avg_p9: (scores.reduce((a, b) => a + b.averages.p9, 0) / scores.length).toFixed(1),
    sectors,
    override_flags: []
  }

  // 4. Run AI Insights
  const insights = await runDashboardInsights(cohortStats)
  return NextResponse.json(insights)
}
