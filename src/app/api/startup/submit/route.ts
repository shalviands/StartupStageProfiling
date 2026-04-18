import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'

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

    if (profile?.role !== 'startup' || profile?.status !== 'approved') {
      // Allow admin/programme_team to submit for testing
      if (!['admin', 'programme_team'].includes(profile?.role || '')) {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const body = await request.json()
    const { team_id } = body

    if (!team_id) {
      return NextResponse.json({ error: 'team_id required' }, { status: 400 })
    }

    // Verify ownership (unless admin/programme_team)
    let query = supabase
      .from('teams')
      .select('id')
      .eq('id', team_id)
    
    if (profile?.role === 'startup') {
      query = query.eq('startup_user_id', user.id)
    }

    const { data: team } = await query.single()

    if (!team) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Count previous submissions
    const { count } = await supabase
      .from('teams')
      .select('id', { count: 'exact' })
      .eq('startup_user_id', user.id)
      .eq('submission_status', 'submitted')

    const submissionNumber = (count || 0) + 1

    // Update to submitted (this preserves all existing data)
    const { error: updateError } = await supabase
      .from('teams')
      .update({
        submission_status: 'submitted',
        submission_number: submissionNumber,
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
    })

  } catch (error) {
    console.error('[Submit Error]:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
