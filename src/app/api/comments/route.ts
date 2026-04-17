import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createServerSupabaseClient()
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (!['programme_team', 'admin'].includes(profile?.role ?? '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const teamId = request.nextUrl.searchParams.get('team_id')
  if (!teamId) return NextResponse.json({ error: 'team_id required' }, { status: 400 })

  const { data, error } = await supabase
    .from('submission_comments')
    .select('*')
    .eq('team_id', teamId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createServerSupabaseClient()
  const { data: profile } = await supabase
    .from('profiles').select('role, full_name').eq('id', user.id).single()

  if (!['programme_team', 'admin'].includes(profile?.role ?? '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { team_id, comment_text, parameter_ref } = body

  if (!team_id || !comment_text?.trim()) {
    return NextResponse.json({ error: 'team_id and comment_text required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('submission_comments')
    .insert({
      team_id,
      commenter_id: user.id,
      commenter_name: profile?.full_name || user.email || 'Programme Team',
      comment_text: comment_text.trim(),
      parameter_ref: parameter_ref || 'overall',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
