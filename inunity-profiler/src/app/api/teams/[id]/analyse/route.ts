import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import { runAIAnalysis } from '@/lib/ai/openrouter'
import { createServerSupabaseClient } from '@/lib/supabase/server'



export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getUserFromRequest()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createServerSupabaseClient()
  const { data: team, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !team) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const analysis = await runAIAnalysis(team)
  return NextResponse.json(analysis)
}
