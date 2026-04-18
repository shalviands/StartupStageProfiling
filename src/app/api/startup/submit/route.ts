import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import { calculateOverallScore, classifyStage } from '@/utils/scores'
import { mapDbToFrontend } from '@/utils/mappers'

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single()

    const isStartup = profile?.role === 'startup'
    const isApproved = profile?.status === 'approved'

    if (isStartup && !isApproved) {
      if (!['admin', 'programme_team'].includes(profile?.role || '')) {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const body = await request.json()
    const { team_id } = body

    if (!team_id) {
      return NextResponse.json({ error: 'team_id required' }, { status: 400 })
    }

    // Fetch FULL record for calculation
    const { data: dbTeam } = await supabase
      .from('teams')
      .select('*')
      .eq('id', team_id)
      .single()

    if (!dbTeam) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Verify ownership for startups
    if (profile?.role === 'startup' && dbTeam.startup_user_id !== user.id) {
       return NextResponse.json({ error: 'Unauthorized ownership' }, { status: 401 })
    }

    // Final Server-Side Calculation
    const mappedTeam = mapDbToFrontend(dbTeam)
    if (!mappedTeam) throw new Error('Mapping failed')

    const { stage } = classifyStage(mappedTeam)
    const { overall, isBonusActive } = calculateOverallScore(mappedTeam)

    // Count previous submissions
    const { count } = await supabase
      .from('teams')
      .select('id', { count: 'exact' })
      .eq('startup_user_id', dbTeam.startup_user_id)
      .eq('submission_status', 'submitted')

    const submissionNumber = (count || 0) + 1

    // Update with FINAL results (Using Admin Client to bypass RLS for final status lock)
    const { error: updateError } = await supabaseAdmin
      .from('teams')
      .update({
        submission_status: 'submitted',
        submission_number: submissionNumber,
        detected_stage: stage,
        overall_weighted_score: overall,
        p9_bonus_active: isBonusActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', team_id)

    if (updateError) {
      console.error('[Submit Error]:', updateError)
      return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      submission_number: submissionNumber,
      team_id: team_id,
      overall,
      stage
    })

  } catch (error) {
    console.error('[Submit Error]:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
