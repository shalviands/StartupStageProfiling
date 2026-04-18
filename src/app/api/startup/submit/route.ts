import { NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { calculateOverallScore, classifyStage } from '@/utils/scores'
import { mapDbToFrontend } from '@/utils/mappers'

export async function POST(request: Request) {
  try {
    console.log('[Submit] Starting submission process')
    
    const user = await getUserFromRequest()
    if (!user) {
      console.error('[Submit] No user found')
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      )
    }

    console.log('[Submit] User ID:', user.id)

    const supabase = await createServerSupabaseClient()
    
    // Verify user role and status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('[Submit] Profile fetch error:', profileError)
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    console.log('[Submit] Profile:', profile)

    if (profile?.role !== 'startup') {
      console.error('[Submit] Wrong role:', profile?.role)
      return NextResponse.json(
        { error: 'Only startups can submit profiles' },
        { status: 403 }
      )
    }

    if (profile?.status !== 'approved') {
      console.error('[Submit] Not approved:', profile?.status)
      return NextResponse.json(
        { error: 'Your account is not approved yet' },
        { status: 403 }
      )
    }

    // Get team_id from request body
    const body = await request.json()
    console.log('[Submit] Request body:', body)

    const { team_id } = body

    if (!team_id) {
      console.error('[Submit] No team_id provided')
      return NextResponse.json(
        { error: 'team_id is required' },
        { status: 400 }
      )
    }

    console.log('[Submit] Team ID:', team_id)

    // Verify this team belongs to the current user and get FULL data
    const { data: team, error: teamFetchError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', team_id)
      .single()

    if (teamFetchError) {
      console.error('[Submit] Team fetch error:', teamFetchError)
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    console.log('[Submit] Found team:', team.id)

    if (team.startup_user_id !== user.id) {
      console.error('[Submit] Ownership mismatch:', team.startup_user_id, 'vs', user.id)
      return NextResponse.json(
        { error: 'You do not own this team' },
        { status: 403 }
      )
    }

    if (team.submission_status === 'submitted') {
      console.error('[Submit] Already submitted')
      return NextResponse.json(
        { error: 'This profile is already submitted' },
        { status: 400 }
      )
    }

    // Server-Side Score Calculation
    const mappedTeam = mapDbToFrontend(team)
    if (!mappedTeam) {
      console.error('[Submit] Mapping failed')
      throw new Error('Mapping failed')
    }

    const { stage } = classifyStage(mappedTeam)
    const { overall, isBonusActive } = calculateOverallScore(mappedTeam)

    // Count existing submissions for this user
    const { count, error: countError } = await supabase
      .from('teams')
      .select('id', { count: 'exact', head: true })
      .eq('startup_user_id', user.id)
      .eq('submission_status', 'submitted')

    if (countError) {
      console.error('[Submit] Count error:', countError)
    }

    const submissionNumber = (count || 0) + 1
    console.log('[Submit] This will be submission number:', submissionNumber)

    // Update to submitted status
    const { data: updated, error: updateError } = await supabaseAdmin
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
      .select()
      .single()

    if (updateError) {
      console.error('[Submit] Update error:', updateError)
      return NextResponse.json(
        { error: `Update failed: ${updateError.message}` },
        { status: 500 }
      )
    }

    console.log('[Submit] Successfully submitted:', updated.id)

    return NextResponse.json({
      success: true,
      submission_number: submissionNumber,
      team_id: updated.id,
      overall,
      stage,
      message: 'Profile submitted successfully',
    }, { status: 200 })

  } catch (error) {
    console.error('[Submit] Unexpected error:', error)
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
