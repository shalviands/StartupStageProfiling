import { classifyStage } from '../../utils/scores'

const INUNITY_SYSTEM_MESSAGE = `
You are the InUnity Startup Diagnosis AI — an expert startup coach,
incubation specialist, and programme evaluator.

InUnity Private Limited runs customised pre-incubation, incubation,
and acceleration programmes. You apply Y Combinator principles,
Lean Startup, Steve Blank Customer Development, TRL/CRL scales,
and ExO framework.

This profiler is a SELF-ASSESSMENT tool. Startups fill it themselves.
Programme team reviews and comments. You assist both.

TONE: Supportive mentor — encouraging but realistic.
Acknowledge progress genuinely. Name gaps directly without harshness.
Give specific actionable advice. Adapt language to stage.

STAGE LANGUAGE:
- Idea Stage: "The most important thing right now is..."
- PSF Stage: "You're asking the right questions. Now..."
- Validation: "The data is telling you..."
- MVP Stage: "You have built it. Now the challenge is..."
- Revenue: "You have proven the model. Now focus on..."
- Growth: "The fundamentals are strong. The next challenge..."

RULES:
ALWAYS: Base insights on actual data, return ONLY valid JSON when requested,
be specific (name parameters, scores, answers), adapt to stage
NEVER: Invent data, use generic phrases ("game-changer", "leverage synergies",
"comprehensive strategy"), claim investor-ready unless stage 5+/CRL 7+/TRL 7+
`

const FREE_MODELS = [
  'meta-llama/llama-3.1-8b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
  'google/gemma-2-9b-it:free',
  'openchat/openchat-7b:free',
] as const

// ── Shared API caller ─────────────────────────────────────────────
async function callOpenRouter(
  userMessage: string,
  maxTokens: number = 1000
): Promise<Record<string, any> | null> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not set')

  for (const model of FREE_MODELS) {
    try {
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://inunity.co',
            'X-Title': 'InUnity Startup Diagnosis Profiler',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: INUNITY_SYSTEM_MESSAGE },
              { role: 'user',   content: userMessage },
            ],
            temperature: 0.4,
            max_tokens: maxTokens,
            response_format: { type: 'json_object' },
          }),
          signal: AbortSignal.timeout(30_000),
        }
      )

      if (!response.ok) {
        console.warn(`[AI] Model ${model} returned ${response.status}`)
        continue
      }

      const data = await response.json()
      const raw = data.choices?.[0]?.message?.content ?? ''
      const clean = raw
        .trim()
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim()

      const parsed = JSON.parse(clean)
      parsed.model_used = model
      console.log(`[AI] Success with model: ${model}`)
      return parsed
    } catch (err) {
      console.warn(`[AI] Model ${model} failed:`, err)
      continue
    }
  }

  console.warn('[AI] All models failed')
  return null
}

// ── FEATURE 1: Profile Analysis ────────────────────────────────────
export interface AnalysisResult {
  strengths: string
  gaps: string
  recommendations: string
  readiness_summary: string
  stage_insight: string
  founder_note: string
  model_used: string
}

export async function runAIAnalysis(
  team: Record<string, any>
): Promise<AnalysisResult> {
  // Pre-calculate dimension averages for the prompt
  const dims = calculateDimensionAverages(team)
  const { override } = classifyStage(team as any)
  const teamWithAvgs = { ...team, ...dims, stage_override_flag: override }

  const prompt = buildAnalysisPrompt(teamWithAvgs)
  const result = await callOpenRouter(prompt, 1000)

  if (result) return result as AnalysisResult
  return ruleBasedAnalysis(team)
}

function buildAnalysisPrompt(team: Record<string, any>): string {
  return `
Analyse this startup profile and return a JSON object.

STARTUP DATA:
  Name: ${team.startup_name || 'Not provided'}
  Sector: ${team.sector || 'Not provided'}
  Product Type: ${team.p3_product_type || 'Not provided'}
  Revenue Stage: ${team.p6_revenue_stage || 'Not provided'}
  Detected Stage: ${team.detected_stage || 'Unknown'}
  TRL: ${team.p3_trl || 'Not assessed'} / 9
  CRL: ${team.p7_crl || 'Not assessed'} / 9

PARAMETER SCORES (1–5 scale, 0 = not assessed):
  P1 Entrepreneur Character: ${team.p1_avg || 0}
  P2 Customer Discovery: ${team.p2_avg || 0}
  P3 Product / TRL: ${team.p3_avg || 0}
  P4 Differentiation: ${team.p4_avg || 0}
  P5 Market Understanding: ${team.p5_avg || 0}
  P6 Business Model: ${team.p6_avg || 0}
  P7 Traction / CRL: ${team.p7_avg || 0}
  P8 Team Capability: ${team.p8_avg || 0}
  P9 Competitive Advantage: ${team.p9_avg || 0}
  Overall Weighted Score: ${team.overall_weighted_score || 0}

KEY ANSWERS:
  Problem they solve: ${team.p1_problem_statement || 'Not provided'}
  Why this team: ${team.p1_why_us || 'Not provided'}
  Customer interviews done: ${team.p2_interview_count || 0}
  Key insight from discovery: ${team.p2_key_insight || 'Not provided'}
  What they built: ${team.p3_built || 'Not provided'}
  Their differentiation: ${team.p4_differentiation || 'Not provided'}
  Target customer: ${team.p5_icp || 'Not provided'}
  Revenue model: ${team.p6_revenue_model || 'Not provided'}
  Active users: ${team.p7_active_users || 0}
  Main competitor: ${team.p9_competitor_awareness || 'Not provided'}

P0 NEED: ${team.p0_need || 'Not specified'}
STAGE OVERRIDE: ${team.stage_override_flag || 'None'}

Return ONLY this JSON:
{
  "strengths": "2-3 sentences on what this team genuinely does well. Be specific — name the actual things they are doing right.",
  "gaps": "2-3 sentences on the most critical gaps. Be direct but constructive. Name the specific parameters.",
  "recommendations": "3-4 sentences of specific, actionable next steps tied to their actual stage and weakest parameters.",
  "readiness_summary": "1 sentence overall assessment. State clearly where they are today.",
  "stage_insight": "1-2 sentences on why they are at this specific stage referencing TRL, CRL, and any override flags.",
  "founder_note": "1 sentence of direct encouragement specific to their situation. Acknowledge something real.",
  "model_used": ""
}`
}

// ── FEATURE 2: Stage Explanation ──────────────────────────────────
export interface StageExplanationResult {
  why_this_stage: string
  what_would_move_them_up: string
  honest_assessment: string
  model_used: string
}

export async function runStageExplanation(
  team: Record<string, any>,
  stage: string,
  overrideFlag: string | null
): Promise<StageExplanationResult> {
  const dims = calculateDimensionAverages(team)
  const prompt = `
A startup has been diagnosed at: ${stage}

Their key scores:
  P1 (Entrepreneur Character): ${dims.p1_avg || 0} / 5
  P2 (Customer Discovery): ${dims.p2_avg || 0} / 5
  P3 (Product/TRL): ${dims.p3_avg || 0} / 5
  P7 (Traction/CRL): ${dims.p7_avg || 0} / 5
  P8 (Team): ${dims.p8_avg || 0} / 5
  TRL: ${team.p3_trl || 'Unknown'}
  CRL: ${team.p7_crl || 'Unknown'}
  Revenue Stage: ${team.p6_revenue_stage || 'Unknown'}
${overrideFlag ? `  OVERRIDE ACTIVE: ${overrideFlag}` : ''}

Return ONLY this JSON:
{
  "why_this_stage": "2-3 sentences explaining clearly why this team is at this stage. Reference specific scores.",
  "what_would_move_them_up": "2-3 sentences on the specific conditions needed to reach the next stage.",
  "honest_assessment": "1 sentence that is direct and honest about where they stand today.",
  "model_used": ""
}`

  const result = await callOpenRouter(prompt, 500)
  if (result) return result as StageExplanationResult
  return {
    why_this_stage: `Based on a TRL of ${team.p3_trl || 'unknown'} and CRL of ${team.p7_crl || 'unknown'}, this team is classified at ${stage}.`,
    what_would_move_them_up: 'Focus on the lowest scoring parameters to advance to the next stage.',
    honest_assessment: 'The team has a clear path forward if they address their critical gaps.',
    model_used: 'rule-based',
  }
}

// ── FEATURE 3: Roadmap Generation ────────────────────────────────
export interface RoadmapResult {
  week1: { title: string; focus: string; actions: string[]; success_metric: string }
  week2: { title: string; focus: string; actions: string[]; success_metric: string }
  week3: { title: string; focus: string; actions: string[]; success_metric: string }
  week4: { title: string; focus: string; actions: string[]; success_metric: string }
  p0_need: string
  p1_need: string
  p2_need: string
  recommended_tools: string[]
  mentor_focus: string
  model_used: string
}

export async function runRoadmapGeneration(
  team: Record<string, any>,
  stage: string,
  stageNumber: number,
  weakestParameters: string[]
): Promise<RoadmapResult> {
  const { stage: calculatedStage, override } = classifyStage(team as any)

  const prompt = `
Generate a personalised 4-week pre-event sprint roadmap for this startup.
 
STARTUP CONTEXT:
  Startup: ${team.startup_name || 'Unknown'}
  Sector: ${team.sector || 'Unknown'}
  Stage: ${calculatedStage} (Stage ${stageNumber} of 6)
  Product Type: ${team.p3_product_type || 'Unknown'}
  Revenue Stage: ${team.p6_revenue_stage || 'Unknown'}
  Team Size: ${team.team_size || 'Unknown'}
 
WEAKEST PARAMETERS (address these):
  ${weakestParameters.map((p, i) => `${i + 1}. ${p}`).join('\n  ')}
 
KEY CONTEXT:
  Problem: ${team.p1_problem_statement || 'Not provided'}
  Built so far: ${team.p3_built || 'Not provided'}
  Active users: ${team.p7_active_users || 0}
  P0 need: ${team.p0_need || 'Not specified'}
  Override Active: ${override || 'None'}

Return ONLY this JSON:
{
  "week1": {
    "title": "Short milestone title (5-7 words)",
    "focus": "Which parameter this week addresses",
    "actions": ["Specific action 1", "Specific action 2", "Specific action 3"],
    "success_metric": "How to know if Week 1 was successful"
  },
  "week2": {
    "title": "Short milestone title",
    "focus": "Which parameter this week addresses",
    "actions": ["Specific action 1", "Specific action 2", "Specific action 3"],
    "success_metric": "How to know if Week 2 was successful"
  },
  "week3": {
    "title": "Short milestone title",
    "focus": "Which parameter this week addresses",
    "actions": ["Specific action 1", "Specific action 2", "Specific action 3"],
    "success_metric": "How to know if Week 3 was successful"
  },
  "week4": {
    "title": "Short milestone title",
    "focus": "Which parameter this week addresses",
    "actions": ["Specific action 1", "Specific action 2", "Specific action 3"],
    "success_metric": "How to know if Week 4 was successful"
  },
  "p0_need": "Single most urgent thing before the event",
  "p1_need": "Most important thing during the programme",
  "p2_need": "Longer-term capability to build after",
  "recommended_tools": [
    "Tool name — why it applies to this team",
    "Tool name — why it applies to this team",
    "Tool name — why it applies to this team"
  ],
  "mentor_focus": "What the mentor should specifically focus on",
  "model_used": ""
}`

  const result = await callOpenRouter(prompt, 1200)
  if (result) return result as RoadmapResult
  return ruleBasedRoadmap(stageNumber, weakestParameters, team)
}

// ── FEATURE 4: Dashboard Insights ────────────────────────────────
export interface DashboardInsightsResult {
  cohort_summary: string
  strongest_cohort_area: string
  biggest_cohort_gap: string
  programme_recommendation: string
  teams_needing_attention: string
  positive_signal: string
  programme_design_tip: string
  model_used: string
}

export async function runDashboardInsights(
  cohortStats: Record<string, any>
): Promise<DashboardInsightsResult> {
  const prompt = `
Analyse this cohort of startups and provide programme-level insights.

COHORT DATA:
  Total startups: ${cohortStats.total}
  Stage distribution:
    Idea Stage: ${cohortStats.idea_count || 0}
    Problem-Solution Fit: ${cohortStats.psf_count || 0}
    Validation Stage: ${cohortStats.validation_count || 0}
    MVP/Pre-Revenue: ${cohortStats.mvp_count || 0}
    Early Revenue: ${cohortStats.revenue_count || 0}
    Growth/Scale: ${cohortStats.growth_count || 0}

AVERAGE SCORES ACROSS COHORT:
  P1 Entrepreneur Character: ${cohortStats.avg_p1 || 0}
  P2 Customer Discovery: ${cohortStats.avg_p2 || 0}
  P3 Product/TRL: ${cohortStats.avg_p3 || 0}
  P4 Differentiation: ${cohortStats.avg_p4 || 0}
  P5 Market Understanding: ${cohortStats.avg_p5 || 0}
  P6 Business Model: ${cohortStats.avg_p6 || 0}
  P7 Traction/CRL: ${cohortStats.avg_p7 || 0}
  P8 Team Capability: ${cohortStats.avg_p8 || 0}
  P9 Competitive Advantage: ${cohortStats.avg_p9 || 0}
  Overall Average: ${cohortStats.avg_overall || 0}

SECTORS: ${cohortStats.sectors?.join(', ') || 'Not provided'}
COMMON OVERRIDE FLAGS: ${cohortStats.override_flags?.join(', ') || 'None'}

Return ONLY this JSON:
{
  "cohort_summary": "2-3 sentences summarising the overall health and readiness of this cohort.",
  "strongest_cohort_area": "1-2 sentences on what this cohort collectively does well.",
  "biggest_cohort_gap": "1-2 sentences on the most critical collective gap.",
  "programme_recommendation": "2-3 sentences on how the programme should be structured.",
  "teams_needing_attention": "1-2 sentences on which profile of team needs most urgent support.",
  "positive_signal": "1 sentence on the most encouraging thing in this cohort's data.",
  "programme_design_tip": "1-2 sentences of a specific programme design suggestion.",
  "model_used": ""
}`

  const result = await callOpenRouter(prompt, 800)
  if (result) return result as DashboardInsightsResult
  return ruleBasedDashboardInsights(cohortStats)
}

// ── Helper: calculate dimension averages ─────────────────────────
function calculateDimensionAverages(team: Record<string, any>) {
  function avg(keys: string[]): number {
    const vals = keys.map(k => Number(team[k]) || 0).filter(v => v > 0)
    if (!vals.length) return 0
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10
  }
  return {
    p1_avg: avg(['p1_problem_score','p1_why_us_score','p1_commitment_score','p1_learning_score','p1_deep_empathy_score','p1_resilience_score','p1_sacrifice_score']),
    p2_avg: avg(['p2_interview_count_score','p2_stakeholder_types_score','p2_key_insight_score','p2_pivoted_score','p2_evidence_score','p2_pilot_users_score','p2_objections_score']),
    p3_avg: avg(['p3_trl_score','p3_built_score','p3_external_testing_score','p3_tech_risk_score','p3_trl_gap_score','p3_ip_score']),
    p4_avg: avg(['p4_differentiation_score','p4_competitors_score','p4_without_us_score','p4_customer_preference_score','p4_hard_to_copy_score','p4_ab_testing_score']),
    p5_avg: avg(['p5_icp_score','p5_market_size_score','p5_urgency_score','p5_gtm_score','p5_unfair_access_score']),
    p6_avg: avg(['p6_revenue_model_score','p6_bmc_score','p6_pricing_tested_score','p6_unit_economics_score']),
    p7_avg: avg(['p7_crl_score','p7_active_users_score','p7_retention_score','p7_growth_score','p7_referrals_score','p7_churn_score']),
    p8_avg: avg(['p8_team_score','p8_missing_skills_score','p8_commitment_score','p8_advisors_score','p8_prior_work_score','p8_internal_challenge_score']),
    p9_avg: avg(['p9_competitor_awareness_score','p9_hard_to_copy_score','p9_ip_score','p9_network_effects_score','p9_switching_costs_score']),
  }
}

// ── Rule-based fallbacks ──────────────────────────────────────────
function ruleBasedAnalysis(team: Record<string, any>): AnalysisResult {
  const dims = calculateDimensionAverages(team)
  const entries = Object.entries(dims) as [string, number][]
  const scored = entries.filter(([, v]) => v > 0)
  const weakest = scored.length
    ? scored.sort(([, a], [, b]) => a - b)[0][0].replace('_avg', '').toUpperCase()
    : 'overall fundamentals'
  const strongest = scored.length
    ? scored.sort(([, a], [, b]) => b - a)[0][0].replace('_avg', '').toUpperCase()
    : 'their commitment'

  return {
    strengths: `The team shows genuine strength in ${strongest}. This is a solid foundation to build on as they progress through the programme.`,
    gaps: `The most critical area to address is ${weakest}. Strengthening this parameter will have the highest impact on their overall readiness and stage progression.`,
    recommendations: `Focus first on the P0 need defined in the roadmap. Run at least 5 structured customer conversations before the next check-in. Complete the Business Model Canvas if not already done.`,
    readiness_summary: `The team is in the early stages of their journey with clear opportunities to strengthen ${weakest} before the programme event.`,
    stage_insight: `Their current TRL and CRL levels place them at this stage. Addressing the weakest link parameter will unlock the path to the next stage.`,
    founder_note: `The fact that you are here, going through this diagnosis process, already puts you ahead of most teams at your stage.`,
    model_used: 'rule-based (AI unavailable)',
  }
}

function ruleBasedRoadmap(
  stageNumber: number,
  weakestParams: string[],
  team: Record<string, any>
): RoadmapResult {
  const stagePlans: Record<number, RoadmapResult> = {
    1: {
      week1: { title: 'Define the problem precisely', focus: 'P1 — Entrepreneur Character', actions: ['Write a one-paragraph problem statement', 'Identify 20 potential people who face this problem', 'Book 5 customer interviews for this week'], success_metric: '5 customer interviews completed and documented' },
      week2: { title: 'Validate the problem exists', focus: 'P2 — Customer Discovery', actions: ['Conduct all 5 interviews using structured questions', 'Document top 3 insights from each conversation', 'Identify patterns and surprising findings'], success_metric: 'Clear evidence of real problem from at least 4 of 5 people' },
      week3: { title: 'Sketch the solution concept', focus: 'P3 — Product/TRL', actions: ['Create a simple wireframe or mockup', 'Build a paper prototype or demo script', 'Show concept to 3 people and collect feedback'], success_metric: 'Concept tested with 3 people and feedback documented' },
      week4: { title: 'Build your Business Model Canvas', focus: 'P6 — Business Model', actions: ['Complete all 9 boxes of the BMC', 'Identify riskiest assumption in the business model', 'Prepare a 3-minute pitch of problem and solution'], success_metric: 'BMC completed and 3-minute pitch delivered to mentor' },
      p0_need: 'Complete at least 10 customer interviews to validate the problem before building anything',
      p1_need: 'Build and test a basic prototype or proof of concept',
      p2_need: 'Develop a clear go-to-market strategy and initial revenue model',
      recommended_tools: ['Customer Interview Framework — for structuring discovery conversations', 'Problem Statement Canvas — for sharpening problem clarity', 'Business Model Canvas — for defining the business logic'],
      mentor_focus: 'Help the founder sharpen their problem statement and design effective customer interview questions',
      model_used: 'rule-based',
    },
  }
  return stagePlans[stageNumber] || stagePlans[1]
}

function ruleBasedDashboardInsights(
  stats: Record<string, any>
): DashboardInsightsResult {
  return {
    cohort_summary: `This cohort of ${stats.total || 0} startups shows a distribution across multiple readiness stages. The majority appear to be in the early validation phases, which is typical for a programme of this nature.`,
    strongest_cohort_area: 'Entrepreneur character and problem clarity tend to be the strongest areas in early-stage cohorts, reflecting the passion that drives founders to join programmes.',
    biggest_cohort_gap: 'Customer discovery and traction metrics are typically the weakest areas, indicating that many teams are building before validating — a common and addressable challenge.',
    programme_recommendation: 'Prioritise customer discovery sessions and structured interview training in the first two weeks. Follow with product-market fit workshops and business model validation exercises.',
    teams_needing_attention: 'Teams with P1 scores below 2.0 or TRL below 3 need immediate one-on-one mentoring before group sessions will be effective for them.',
    positive_signal: 'The presence of teams across multiple stages is a strength — peer learning between validation-stage and MVP-stage teams can accelerate the whole cohort.',
    programme_design_tip: 'Consider grouping teams by stage for technical workshops while mixing stages for pitch practice and peer feedback sessions.',
    model_used: 'rule-based',
  }
}
