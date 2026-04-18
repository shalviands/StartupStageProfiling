// src/utils/scores.ts
import type { TeamProfile } from '@/types/team.types'

/**
 * InUnity Startup Diagnosis Profiler — Scoring & Stage Logic v2.0
 */

// 1. Corrected Weights (Section 1 of Blueprint)
const BASE_WEIGHTS = {
  p1: 0.15,
  p2: 0.13,
  p3: 0.13,
  p4: 0.07,
  p5: 0.12,
  p6: 0.11,
  p7: 0.11,
  p8: 0.12,
  p9: 0.06,
}

// Weights when P9 Bonus (+3%) is Active (stageNumber >= 4)
const BONUS_WEIGHTS = {
  p1: 0.15,
  p2: 0.14, // +1%
  p3: 0.13,
  p4: 0.07,
  p5: 0.13, // +1%
  p6: 0.11,
  p7: 0.12, // +1% (returns to original)
  p8: 0.12,
  p9: 0.09, // 6% + 3%
}

export const STAGES = [
  'Idea Stage',
  'Problem-Solution Fit',
  'Validation Stage',
  'MVP / Pre-Revenue',
  'Early Revenue',
  'Growth / Scale'
]

/**
 * Empty Score Handling: Score 0 = not answered. Exclude from averages.
 * Rounding: strictly 1 decimal place.
 */
export function calculateParameterAverage(team: any, prefix: string): number {
  const scores: number[] = []
  
  // Custom mapping for TRL/CRL to 1-5 scale
  if (prefix === 'p3' && team.p3_trl) {
    scores.push(mapTRLCRLToScore(Number(team.p3_trl)))
  }
  if (prefix === 'p7' && team.p7_crl) {
    scores.push(mapTRLCRLToScore(Number(team.p7_crl)))
  }

  // Iterate through all fields starting with prefix and ending with _score
  Object.keys(team).forEach(key => {
    if (key.startsWith(`${prefix}_`) && key.endsWith('_score')) {
      // Skip trl_score/crl_score when prefix is p3/p7 (handled above)
      if (prefix === 'p3' && key === 'p3_trl_score') return
      if (prefix === 'p7' && key === 'p7_crl_score') return

      const val = team[key]
      if (typeof val === 'number' && val > 0 && val <= 5) {
        scores.push(val)
      }
    }
  })
  
  if (scores.length === 0) return 0
  const sum = scores.reduce((a, b) => a + b, 0)
  const avg = sum / scores.length
  return Math.round(avg * 10) / 10
}

/**
 * TRL and CRL Mapping (Section 5 of Blueprint)
 */
function mapTRLCRLToScore(val: number): number {
  if (val <= 2) return 1
  if (val <= 4) return 2
  if (val <= 6) return 3
  if (val <= 8) return 4
  return 5
}

/**
 * Stage Classification Logic (Section 4 of Blueprint)
 * Uses "Weakest Link" methodology.
 */
export function classifyStage(team: TeamProfile): { 
  stage: string, 
  level: number, 
  override: string | null,
  p9Bonus: boolean 
} {
  const p1 = calculateParameterAverage(team, 'p1')
  const p2 = calculateParameterAverage(team, 'p2')
  const p3 = calculateParameterAverage(team, 'p3')
  const p7 = calculateParameterAverage(team, 'p7')
  const p6 = calculateParameterAverage(team, 'p6')
  const trl = Number(team.p3_trl) || 0
  const rev = (team.p6_revenue_stage || '').toLowerCase()
  
  let stageNumber = 1 // Default to Idea Stage

  // Trigger Conditions
  // 2. Problem-Solution Fit
  if (p1 >= 2.0 && p2 >= 2.0 && (trl >= 3 && trl <= 4) && p7 < 2.0) {
    stageNumber = 2
  }
  // 3. Validation Stage
  if ((trl >= 4 && trl <= 6) && p2 >= 2.5 && p7 >= 1.5) {
    stageNumber = 3
  }
  // 4. MVP / Pre-Revenue
  if ((trl >= 6 && trl <= 7) && rev.includes('pre-revenue') && p7 >= 2.0 && p6 >= 2.0) {
    stageNumber = 4
  }
  // 5. Early Revenue
  if (rev.includes('revenue') && !rev.includes('pre-revenue') && p7 >= 3.0 && trl >= 7) {
    stageNumber = 5
  }
  // 6. Growth / Scale
  const allParamsAvg = calculateGlobalAverage(team)
  if ((rev.includes('recurring') || rev.includes('scaling')) && p7 >= 4.0 && allParamsAvg >= 3.5) {
    stageNumber = 6
  }

  // WEAKEST LINK OVERRIDES (Applied in order)
  let override: string | null = null

  // 1. If P1 < 2.0: Cap at Idea Stage
  if (p1 < 2.0 && stageNumber > 1) {
    stageNumber = 1
    override = "Entrepreneur conviction and problem clarity must be strengthened before progressing"
  }
  // 2. If P3 < 2.0: Cap at PSF
  if (p3 < 2.0 && stageNumber > 2) {
    stageNumber = Math.min(stageNumber, 2)
    override = "Product readiness is the critical blocker"
  }
  // 3. If P8 < 2.0: Decrement stage by 1
  const p8 = calculateParameterAverage(team, 'p8')
  if (p8 < 2.0 && stageNumber > 1) {
    stageNumber = Math.max(1, stageNumber - 1)
    if (!override) override = "Team capability and commitment gaps are limiting overall readiness"
  }

  return {
    stage: STAGES[stageNumber - 1] || STAGES[0],
    level: stageNumber,
    override,
    p9Bonus: stageNumber >= 4
  }
}

function calculateGlobalAverage(team: TeamProfile): number {
  const p1 = calculateParameterAverage(team, 'p1')
  const p2 = calculateParameterAverage(team, 'p2')
  const p3 = calculateParameterAverage(team, 'p3')
  const p4 = calculateParameterAverage(team, 'p4')
  const p5 = calculateParameterAverage(team, 'p5')
  const p6 = calculateParameterAverage(team, 'p6')
  const p7 = calculateParameterAverage(team, 'p7')
  const p8 = calculateParameterAverage(team, 'p8')
  const p9 = calculateParameterAverage(team, 'p9')
  const valid = [p1, p2, p3, p4, p5, p6, p7, p8, p9].filter(v => v > 0)
  if (valid.length === 0) return 0
  return valid.reduce((a, b) => a + b, 0) / valid.length
}

export function calculateOverallScore(team: TeamProfile): { 
  overall: number, 
  isBonusActive: boolean,
  averages: Record<string, number>
} {
  const averages: Record<string, number> = {
    p1: calculateParameterAverage(team, 'p1'),
    p2: calculateParameterAverage(team, 'p2'),
    p3: calculateParameterAverage(team, 'p3'),
    p4: calculateParameterAverage(team, 'p4'),
    p5: calculateParameterAverage(team, 'p5'),
    p6: calculateParameterAverage(team, 'p6'),
    p7: calculateParameterAverage(team, 'p7'),
    p8: calculateParameterAverage(team, 'p8'),
    p9: calculateParameterAverage(team, 'p9'),
  }

  const { p9Bonus } = classifyStage(team)
  const W = p9Bonus ? BONUS_WEIGHTS : BASE_WEIGHTS

  const weightedSum = Object.entries(averages).reduce((sum, [key, avg]) => {
    const weight = (W as any)[key]
    return sum + (avg * weight)
  }, 0)

  return {
    overall: Math.round(weightedSum * 10) / 10,
    isBonusActive: p9Bonus,
    averages
  }
}

/**
 * Mentor Assignment Logic (Section 6 of Blueprint)
 */
export function getMentorAssignment(team: TeamProfile): string {
  const { averages } = calculateOverallScore(team)
  
  // Find lowest parameter among P1-P8
  let lowestParam = 'p1'
  let lowestScore = 6

  const paramsToTest = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8']
  paramsToTest.forEach(p => {
    const score = averages[p]
    if (score > 0 && score < lowestScore) {
      lowestScore = score
      lowestParam = p
    }
  })

  // Edge case: if P9 is even lower
  if (averages.p9 > 0 && averages.p9 < lowestScore) {
    return 'Competitive Strategy Mentor'
  }

  const map: Record<string, string> = {
    p1: 'Entrepreneurship Mentor',
    p2: 'Customer Research Mentor',
    p3: 'Technical Mentor',
    p4: 'Product Strategy Mentor',
    p5: 'Market Strategy Mentor',
    p6: 'Business Model Mentor',
    p7: 'Growth Mentor',
    p8: 'Team Building Mentor',
  }

  return map[lowestParam] || 'General Startup Mentor'
}

// Styling Helpers (Strict Contrast Rules)
export function scoreColor(score: number | null): string {
  if (score === null || score === 0) return '#3B5070' // Var(--slate)
  if (score >= 4.0) return '#FFFFFF' // On Teal
  if (score >= 3.0) return '#0F2647' // On Gold
  return '#FFFFFF' // On Coral
}

export function scoreBg(score: number | null): string {
  if (score === null || score === 0) return '#F4F6F9' // Var(--smoke)
  if (score >= 4.0) return '#1A7A6E' // Var(--teal)
  if (score >= 3.0) return '#E8A020' // Var(--gold)
  return '#E84B3A' // Var(--coral)
}

export function scoreLabel(score: number | null): string {
  if (score === null || score === 0) return 'Not Answered'
  if (score >= 4.5) return 'Exceptional'
  if (score >= 4.0) return 'Strong / Ready'
  if (score >= 3.0) return 'Developing / Potential'
  if (score >= 2.0) return 'Initial / Early'
  return 'Gaps Identified'
}

/**
 * Heuristic Roadmap (Section 13 of Blueprint — Fallback)
 */
export function getRoadmap(team: TeamProfile): any[] {
  const { level } = classifyStage(team)
  
  if (level <= 1) return [
    { priority: 'P1', action: 'Define core problem & why us', supportFrom: 'Discovery Coach', byWhen: 'Week 1' },
    { priority: 'P2', action: 'Conduct 10+ stakeholder discovery interviews', supportFrom: 'Lead Mentor', byWhen: 'Week 2-3' },
    { priority: 'P1', action: 'Synthesize key insights into value prop', supportFrom: 'Incubation Team', byWhen: 'Week 4' },
  ]
  if (level === 2) return [
    { priority: 'P1', action: 'Identify critical TRL gap & tech risk', supportFrom: 'Tech Mentor', byWhen: 'Week 1-2' },
    { priority: 'P2', action: 'Competitor deep dive & differentiation audit', supportFrom: 'Incubation Lead', byWhen: 'Week 3' },
    { priority: 'P1', action: 'Validate solution w/ 5 potential users', supportFrom: 'Market Expert', byWhen: 'Week 4' },
  ]
  if (level === 3) return [
    { priority: 'P1', action: 'Build GTM strategy for initial ICP', supportFrom: 'Strategy Lead', byWhen: 'Week 1-2' },
    { priority: 'P2', action: 'Draft Business Model Canvas V1', supportFrom: 'Finance Mentor', byWhen: 'Week 3' },
    { priority: 'P1', action: 'Scope MVP feature lock set', supportFrom: 'Tech Lead', byWhen: 'Week 4' },
  ]
  if (level >= 4) return [
    { priority: 'P0', action: 'Define core retention loop & NORTH STAR', supportFrom: 'Ops Lead', byWhen: 'Week 1' },
    { priority: 'P1', action: 'Test pricing & unit economic model', supportFrom: 'Strategic Finance', byWhen: 'Week 2-3' },
    { priority: 'P2', action: 'Build defensibility & switching cost map', supportFrom: 'Advisory Board', byWhen: 'Week 4' },
  ]
  return []
}
