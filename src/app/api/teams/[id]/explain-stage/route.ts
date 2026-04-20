import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import { runStageExplanation } from '@/lib/ai/openrouter'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { classifyStage } from '@/utils/scores'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getUserFromRequest()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createServerSupabaseClient()
  
  // 1. Fetch team with ownership check (bypassed RLS via admin client)
  const { data: team, error } = await supabaseAdmin
    .from('teams')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !team) {
    return NextResponse.json({ error: 'Team not found or access denied' }, { status: 404 })
  }

  // 2. Run classification to get current stage details
  const { stage, override } = classifyStage(team)

  // 3. Run AI Explanation
  const explanation = await runStageExplanation(team, stage, override)
  return NextResponse.json(explanation)
}
