import { NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import * as XLSX from 'xlsx'
import { mapDbToFrontend } from '@/utils/mappers'
import { calculateOverallScore, classifyStage } from '@/utils/scores'
import { PARAMETERS_CONFIG } from '@/config/parameters'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()
    
    const { data: teamRow } = await supabaseAdmin
      .from('teams')
      .select('*')
      .eq('id', params.id)
      .single()

    if (!teamRow) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const team = mapDbToFrontend(teamRow)
    if (!team) {
      return NextResponse.json({ error: 'Mapping failed' }, { status: 500 })
    }

    const { overall, averages } = calculateOverallScore(team)
    const { stage, level } = classifyStage(team)

    // --- SHEET 1: STARTUP PROFILE ---
    const profileData = [
      ['FIELD', 'VALUE'],
      ['Startup Name', team.startupName || 'N/A'],
      ['Sector', team.sector || 'N/A'],
      ['Institution', team.institution || 'N/A'],
      ['Interviewer', team.interviewer || 'N/A'],
      ['Interview Date', team.interviewDate || 'N/A'],
      ['Overall Score', overall],
      ['Detected Stage', stage],
      ['Strategic Level', level],
      ['Submission #', team.submission_number || 1],
      ['Submitted At', team.created_at],
    ]

    // --- SHEET 2: SCORE BREAKDOWN ---
    const scoreData = [['PARAMETER', 'TITLE', 'SCORE', 'OBSERVATION']]
    PARAMETERS_CONFIG.forEach((p, idx) => {
      const score = averages[`p${idx + 1}`] || 0
      const obs = (team as any)[`p${idx + 1}_observation`] || ''
      scoreData.push([`P${idx + 1}`, p.title, score.toFixed(1), obs])
    })

    // --- SHEET 3: DYNAMIC ROADMAP (ON-THE-FLY) ---
    const roadmapData = [['PRIORITY', 'ISSUE AREA', 'RECOMMENDED ACTION', 'TARGET TIMELINE']]
    
    // --- SHEET 4: DETAILED ANSWERS ---
    const answersData = [['PARAMETER', 'QUESTION', 'ANSWER', 'SCORE']]
    PARAMETERS_CONFIG.forEach((p, idx) => {
      [...p.coreQs, ...p.deepDiveQs].forEach((q) => {
         const ans = (team as any)[`${p.id}_${q.id}`] || 'No answer provided'
         const score = (team as any)[`${p.id}_${q.id}_score`]
         answersData.push([
           p.title,
           q.label,
           ans,
           score !== undefined && score !== null ? score : 'N/A'
         ])
      })
    })

    // Logic: Identify areas scoring below 3.5 and suggest actions
    const lowScores = Object.entries(averages)
      .filter(([_, score]) => score < 3.5)
      .sort(([_, a], [__, b]) => a - b) // Scariest first

    lowScores.forEach(([pKey, score]) => {
      let action = 'Continuous monitoring and optimization required.'
      const pIdx = parseInt(pKey.replace('p', '')) - 1
      const pTitle = PARAMETERS_CONFIG[pIdx]?.title

      if (score < 2) {
        action = `CRITICAL: Re-evaluate ${pTitle} fundamentals. Deep dive into stakeholder needs.`
      } else if (score < 3) {
        action = `IMPROVE: Strengthen ${pTitle} documentation and evidence. Validate with external testing.`
      } else {
        action = `REFINE: Polish ${pTitle} based on user feedback to reach readiness threshold.`
      }

      roadmapData.push([
        score < 2 ? 'P0 (Critical)' : 'P1 (High)',
        pTitle,
        action,
        score < 2 ? 'Next 7 Days' : 'Next 14 Days'
      ])
    })

    if (roadmapData.length === 1) {
      roadmapData.push(['LOW', 'All Areas', 'Operational excellence achieved. Scaling recommended.', 'Next 30 Days'])
    }

    // CREATE WORKBOOK
    const wb = XLSX.utils.book_new()
    
    const wsProfile = XLSX.utils.aoa_to_sheet(profileData)
    const wsScores = XLSX.utils.aoa_to_sheet(scoreData)
    const wsAnswers = XLSX.utils.aoa_to_sheet(answersData)
    const wsRoadmap = XLSX.utils.aoa_to_sheet(roadmapData)

    XLSX.utils.book_append_sheet(wb, wsProfile, 'Startup Profile')
    XLSX.utils.book_append_sheet(wb, wsScores, 'Score Analysis')
    XLSX.utils.book_append_sheet(wb, wsAnswers, 'Detailed Answers')
    XLSX.utils.book_append_sheet(wb, wsRoadmap, 'Strategic Roadmap')

    // Generate buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    const filename = `${team.startupName || 'Startup'}_Analysis_${new Date().toISOString().split('T')[0]}.xlsx`

    return new NextResponse(buf as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename.replace(/ /g, '_')}"`,
      },
    })

  } catch (error) {
    console.error('[Excel Generation Error]:', error)
    return NextResponse.json(
      { error: 'Excel generation failed' },
      { status: 500 }
    )
  }
}
