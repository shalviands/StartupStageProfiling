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
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[GET /api/teams] DB error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error('[GET /api/teams] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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
    const { data, error } = await supabase
      .from('teams')
      .insert({
        user_id:    user.id,
        team_name:  body.teamName  ?? '',
        startup_name: body.startupName ?? '',
        sector:     body.sector    ?? '',
        institution: body.institution ?? '',
        team_size:  body.teamSize  ?? '',
        roles:      body.roles     ?? '',
        interviewer: body.interviewer ?? '',
        roadmap:    body.roadmap   ?? [],
      })
      .select()
      .single()

    if (error) {
      console.error('[POST /api/teams] DB error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('[POST /api/teams] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
