import { NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { calculateOverallScore, classifyStage } from '@/utils/scores'
import { mapDbToFrontend, mapFrontendToDb } from '@/utils/mappers'

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest()
    if (!user) {
      console.error('[Submit] No user found')
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      )
    }

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

    if (profile?.role !== 'startup') {
      console.error('[Submit] Forbidden: wrong role:', profile?.role)
      return NextResponse.json(
        { error: 'Only startups can submit profiles' },
        { status: 403 }
      )
    }

    if (profile?.status !== 'approved') {
      console.error('[Submit] Forbidden: account not approved:', profile?.status)
      return NextResponse.json(
        { error: 'Your account is not approved yet' },
        { status: 403 }
      )
    }

    // Get team_id & team_data from request body
    const body = await request.json()
    const { team_id, team_data } = body

    if (!team_id) {
      console.error('[Submit] No team_id provided')
      return NextResponse.json(
        { error: 'team_id is required' },
        { status: 400 }
      )
    }

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

    if (team.startup_user_id !== user.id) {
      console.error('[Submit] Ownership mismatch for team:', team_id)
      return NextResponse.json(
        { error: 'You do not own this team' },
        { status: 403 }
      )
    }

    if (team.submission_status === 'submitted') {
      return NextResponse.json(
        { error: 'This profile is already submitted' },
        { status: 400 }
      )
    }

    // Server-Side Score Calculation
    const mappedTeam = mapDbToFrontend(team)
    if (!mappedTeam) {
      console.error('[Submit] Mapping failed for team:', team_id)
      throw new Error('Mapping failed')
    }

    // Combine existing team object with requested changes (if any frontend sync data)
    let finalFrontendTeam = { ...mappedTeam }
    
    if (team_data) {
      // Clean protected fields from frontend payload
      delete team_data.submission_status
      delete team_data.diagnosis_released
      delete team_data.submission_number
      
      finalFrontendTeam = { ...finalFrontendTeam, ...team_data }
    }

    const { stage } = classifyStage(finalFrontendTeam)
    const { overall, isBonusActive } = calculateOverallScore(finalFrontendTeam)

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

    const dbUpdateData = {
      ...mapFrontendToDb(finalFrontendTeam),
      submission_status: 'submitted',
      submission_number: submissionNumber,
      detected_stage: stage,
      overall_weighted_score: overall,
      updated_at: new Date().toISOString()
    }

    // Commit final submission — Admin client bypasses RLS status-lock
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('teams')
      .update(dbUpdateData)
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
