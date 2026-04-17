import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'

export async function GET() {
  try {
    const user = await getUserFromRequest()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()
    
    // Check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    let query = supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false })

    if (profile?.role === 'startup') {
      query = query.eq('startup_user_id', user.id)
    } else {
      query = query.eq('user_id', user.id)
    }

    const { data, error } = await query
    if (error) {
      console.error('[GET /api/teams] Policy or Query error:', error.message, error.details)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error('[GET /api/teams] Unexpected error:', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const supabase = await createServerSupabaseClient()

    // Check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const insertData: any = {
      user_id:      user.id,
      team_name:    body.teamName    ?? 'New Session',
      startup_name: body.startupName ?? '',
      sector:       body.sector      ?? '',
      institution:  body.institution   ?? '',
      team_size:    body.teamSize    ?? '',
      roles:        body.roles       ?? '',
      interviewer:  body.interviewer   ?? '',
      p8_team_members: body.p8_team_members ?? [],
      submission_status: 'draft',
      diagnosis_visible: false,
    }

    if (profile?.role === 'startup') {
      insertData.startup_user_id = user.id
    }

    const { data, error } = await supabase
      .from('teams')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('[POST /api/teams] INSERT error:', error.message, error.details)
      return NextResponse.json({ error: error.message, details: error.details }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('[POST /api/teams] Crash:', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}
