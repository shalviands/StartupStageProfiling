const FREE_MODELS = [
  'meta-llama/llama-3.1-8b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
  'google/gemma-2-9b-it:free',
] as const

export interface AnalysisResult {
  executive_summary: string
  strategic_strengths: string
  critical_gaps: string
  roadmap_focus: string
  model_used: string
}

function buildPrompt(team: Record<string, any>): string {
  const pData = [
    `P1 (Founder/Problem): ${team.p1_problem_score || 0}/5 - Obs: ${team.p1_observation || 'N/A'}`,
    `P2 (Discovery): ${team.p2_interview_count_score || 0}/5 - Obs: ${team.p2_observation || 'N/A'}`,
    `P3 (Product/TRL): ${team.p3_trl_score || 0}/5 - Obs: ${team.p3_observation || 'N/A'}`,
    `P4 (Differentiation): ${team.p4_differentiation_score || 0}/5 - Obs: ${team.p4_observation || 'N/A'}`,
    `P5 (Market/ICP): ${team.p5_icp_score || 0}/5 - Obs: ${team.p5_observation || 'N/A'}`,
    `P6 (Biz Model): ${team.p6_revenue_model_score || 0}/5 - Obs: ${team.p6_observation || 'N/A'}`,
    `P7 (Traction/CRL): ${team.p7_active_users_score || 0}/5 - Obs: ${team.p7_observation || 'N/A'}`,
    `P8 (Team): ${team.p8_team_score || 0}/5 - Obs: ${team.p8_observation || 'N/A'}`,
    `P9 (Advantage): ${team.p9_competitor_awareness_score || 0}/5 - Obs: ${team.p9_observation || 'N/A'}`,
  ].join('\n')

  return `You are a Senior Startup Incubation Strategist at InUnity.
Your goal is to provide a high-density, professional diagnostic summary for this startup profile.
Return ONLY valid JSON with these exact keys:
"executive_summary", "strategic_strengths", "critical_gaps", "roadmap_focus"

Profile Context:
Startup: ${team.startup_name || 'Untitled'}
Sector: ${team.sector || 'N/A'} | Institution: ${team.institution || 'N/A'}
Level: ${team.detected_stage || 'Unknown'} | Weighted Score: ${team.overall_weighted_score || 0}/5
Override: ${team.stage_override_flag || 'None'}

9-Parameter Diagnostics:
${pData}

Instructions:
1. executive_summary: 2 sentences max. High-level tier classification.
2. strategic_strengths: Bulleted list of Px parameters where they excel.
3. critical_gaps: Focus on the "Weakest Link" (Override) and its impact.
4. roadmap_focus: Immediate 4-week priority to unlock the next level.

No markdown tags. No thinking out loud. Just a pure JSON object.`
}

async function callOpenRouter(
  model: string,
  prompt: string
): Promise<AnalysisResult | null> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not set')

  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://inunity.co',
          'X-Title': 'InUnity Startup Profiler',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 800,
          response_format: { type: 'json_object' },
        }),
        signal: AbortSignal.timeout(45_000),
      }
    )

    if (!response.ok) return null

    const data = await response.json()
    const raw = data.choices?.[0]?.message?.content ?? ''
    
    const clean = raw
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    return JSON.parse(clean)
  } catch (e) {
    console.warn(`[AI] Failure with model ${model}:`, e)
    return null
  }
}

function ruleBasedFallback(team: Record<string, any>): AnalysisResult {
  const stage = team.detected_stage || 'IDEA'
  const override = team.stage_override_flag || 'None'

  return {
    executive_summary: `Team is currently at ${stage} with a weighted score of ${team.overall_weighted_score || 0}.`,
    strategic_strengths: `Focus on problem clarity and initial founder commitment.`,
    critical_gaps: override !== 'None' ? `Highest priority gap is ${override}, which is currently capping growth tier.` : 'Foundational validation with real users.',
    roadmap_focus: `Address core ${override || 'P1'} gaps and complete customer discovery cycle.`,
    model_used: 'rule-based (AI offline)',
  }
}

export async function runAIAnalysis(
  team: Record<string, any>
): Promise<AnalysisResult> {
  const prompt = buildPrompt(team)

  for (const model of FREE_MODELS) {
    const result = await callOpenRouter(model, prompt)
    if (result) {
      return { ...result, model_used: model }
    }
  }

  return ruleBasedFallback(team)
}
