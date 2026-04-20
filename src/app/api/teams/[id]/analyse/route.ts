import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import { runAIAnalysis } from '@/lib/ai/openrouter'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getUserFromRequest()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createServerSupabaseClient()
  
  // 1. Fetch user role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role

  // 2. Fetch team with ownership check (bypassed RLS via admin client)
  let query = supabaseAdmin.from('teams').select('*').eq('id', id)

  if (role === 'startup') {
    query = query.or(`user_id.eq.${user.id},startup_user_id.eq.${user.id}`)
  } else if (role === 'admin' || role === 'programme_team') {
    // Admins/Programme team can analyze any team
  } else {
    query = query.eq('user_id', user.id)
  }

  const { data: team, error } = await query.single()

  if (error || !team) {
    return NextResponse.json({ error: 'Team not found or access denied' }, { status: 404 })
  }

  const analysis = await runAIAnalysis(team)
  return NextResponse.json(analysis)
}
