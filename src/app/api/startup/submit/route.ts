import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createServerSupabaseClient()
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()

    // We allow anyone who is currently authenticated to submit, 
    // provided they own the team record (checked in the update query below).
    // This allows admins/programme-team members to submit for test-startups they created.

    const { team_id } = await request.json()
    if (!team_id) return NextResponse.json({ error: 'team_id required' }, { status: 400 })

    // Calculate submission number
    const { count } = await supabase
      .from('teams')
      .select('id', { count: 'exact', head: true })
      .eq('startup_user_id', user.id)
      .eq('submission_status', 'submitted')

    const submission_number = (count ?? 0) + 1

    const { data, error } = await supabase
      .from('teams')
      .update({
        submission_status: 'submitted',
        submission_number,
        updated_at: new Date().toISOString()
      })
      .eq('id', team_id)
      .eq('startup_user_id', user.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
