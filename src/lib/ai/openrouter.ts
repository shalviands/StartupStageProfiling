const FREE_MODELS = [
  'meta-llama/llama-3.1-8b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
  'google/gemma-2-9b-it:free',
  'openchat/openchat-7b:free',
] as const

export interface AnalysisResult {
  strengths: string
  gaps: string
  recommendations: string
  readiness_summary: string
  model_used: string
}

function buildPrompt(team: Record<string, any>): string {
  return `You are an expert startup incubation coach.
Analyse this startup profile and return ONLY valid JSON with these keys:
strengths, gaps, recommendations, readiness_summary
No markdown. No explanation. Just JSON.

Profile:
Startup: ${team.startup_name || 'Unknown'}
Sector: ${team.sector || 'Unknown'}
Problem score: ${team.problem_score || 0}/5
Solution score: ${team.solution_score || 0}/5
Market score: ${team.customer_interview_score || 0}/5
Business model score: ${team.revenue_model_score || 0}/5
Pitch score: ${team.pitch_deck_score || 0}/5
Revenue stage: ${team.revenue_stage || 'Unknown'}
TRL: ${team.trl || '?'} | BRL: ${team.brl || '?'} | CRL: ${team.crl || '?'}
Users tested: ${team.users_tested || 0}
Stakeholder interactions: ${team.stakeholders_interacted || 0}
P0 need: ${team.p0_need || 'Not specified'}`
}

async function callOpenRouter(
  model: string,
  prompt: string
): Promise<AnalysisResult | null> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not set')

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
        temperature: 0.4,
        max_tokens: 600,
        response_format: { type: 'json_object' },
      }),
      signal: AbortSignal.timeout(30_000),
    }
  )

  if (!response.ok) {
    throw new Error(`OpenRouter ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()
  const raw = data.choices?.[0]?.message?.content ?? ''
  
  try {
    const clean = raw
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    return JSON.parse(clean)
  } catch (e) {
    console.error('[AI] Failed to parse JSON response:', raw)
    return null
  }
}

function ruleBasedFallback(team: Record<string, any>): AnalysisResult {
  const scores: Record<string, number> = {
    problem:  team.problem_score || 0,
    solution: team.solution_score || 0,
    market:   team.customer_interview_score || 0,
    business: team.revenue_model_score || 0,
    pitch:    team.pitch_deck_score || 0,
  }
  const nonZero = Object.entries(scores).filter(([, v]) => v > 0)
  const weakest = nonZero.length
    ? nonZero.sort(([, a], [, b]) => a - b)[0][0]
    : 'overall fundamentals'
  const strongest = nonZero.length
    ? nonZero.sort(([, a], [, b]) => b - a)[0][0]
    : 'team commitment'

  return {
    strengths: `The team shows relative strength in ${strongest}. There is visible commitment and domain focus.`,
    gaps: `The weakest area identified is ${weakest}, which needs structured attention before the event.`,
    recommendations: `Focus on P0 priorities. Complete the pitch deck and validate with at least 5 customers before the event.`,
    readiness_summary: `Team is in early stages with immediate focus needed on ${weakest}.`,
    model_used: 'rule-based (AI unavailable)',
  }
}

export async function runAIAnalysis(
  team: Record<string, any>
): Promise<AnalysisResult> {
  const prompt = buildPrompt(team)

  for (const model of FREE_MODELS) {
    try {
      const result = await callOpenRouter(model, prompt)
      if (result) {
        console.log(`[AI] Success with model: ${model}`)
        return { ...result, model_used: model }
      }
    } catch (error) {
      console.warn(`[AI] Model ${model} failed:`, error)
      continue
    }
  }

  console.warn('[AI] All models failed, using rule-based fallback')
  return ruleBasedFallback(team)
}
