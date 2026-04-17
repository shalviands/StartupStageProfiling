import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import { runRoadmapGeneration } from '@/lib/ai/openrouter'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { classifyStage, calculateOverallScore } from '@/utils/scores'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getUserFromRequest()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createServerSupabaseClient()
  
  // 1. Fetch team with ownership check
  const { data: team, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !team) {
    return NextResponse.json({ error: 'Team not found or access denied' }, { status: 404 })
  }

  // 2. Identify weakest parameters for the AI
  const scores = calculateOverallScore(team)
  const weakest = Object.entries({
    p1: scores.p1, p2: scores.p2, p3: scores.p3, p4: scores.p4,
    p5: scores.p5, p6: scores.p6, p7: scores.p7, p8: scores.p8, p9: scores.p9
  })
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3)
    .map(([k]) => k.toUpperCase())

  // 3. Run classification to get current stage details
  const { stage, level } = classifyStage(team)

  // 4. Run AI Roadmap Generation
  const roadmapData = await runRoadmapGeneration(team, stage, level, weakest)
  
  if (!roadmapData) {
    return NextResponse.json({ error: 'AI Roadmap generation failed' }, { status: 500 })
  }

  // 5. Persist to Database (converting the AI structure to the roadmap JSONB format)
  // We'll store the entire week structure as a summary or map it to the existing structure
  // The user requested saving it to the database. We can update the 'roadmap' column.
  
  const { error: updateError } = await supabase
    .from('teams')
    .update({ 
      roadmap: [
        { priority: 'W1', action: roadmapData.week1.title + ': ' + roadmapData.week1.actions[0], supportFrom: roadmapData.week1.focus, byWhen: 'Week 1' },
        { priority: 'W2', action: roadmapData.week2.title + ': ' + roadmapData.week2.actions[0], supportFrom: roadmapData.week2.focus, byWhen: 'Week 2' },
        { priority: 'W3', action: roadmapData.week3.title + ': ' + roadmapData.week3.actions[0], supportFrom: roadmapData.week3.focus, byWhen: 'Week 3' },
        { priority: 'W4', action: roadmapData.week4.title + ': ' + roadmapData.week4.actions[0], supportFrom: roadmapData.week4.focus, byWhen: 'Week 4' }
      ]
    })
    .eq('id', id)

  if (updateError) {
    console.error('[AI Roadmap] Failed to save to DB:', updateError)
  }

  return NextResponse.json(roadmapData)
}
