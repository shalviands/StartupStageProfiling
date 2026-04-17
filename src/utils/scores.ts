import type { TeamProfile } from '@/types/team.types'

// BASE WEIGHTS (P1-P9)
const WEIGHTS = {
  p1: 0.16,
  p2: 0.13,
  p3: 0.14,
  p4: 0.07,
  p5: 0.12,
  p6: 0.11,
  p7: 0.12,
  p8: 0.12,
  p9: 0.03, // Base advantage weight
}

export const STAGES = [
  'IDEA / CONCEPTION',
  'PROBLEM-SOLUTION FIT',
  'VALIDATION / TRACTION',
  'MVP / PRE-REVENUE',
  'REVENUE / PRODUCT-MARKET FIT',
  'GROWTH / SCALE'
]

export function calculateParameterAverage(team: TeamProfile, prefix: string): number {
  const scores: number[] = []
  Object.keys(team).forEach(key => {
    if (key.startsWith(`${prefix}_`) && key.endsWith('_score')) {
      const val = (team as any)[key]
      if (typeof val === 'number' && val > 0) {
        scores.push(val)
      }
    }
  })
  
  if (scores.length === 0) return 0
  const sum = scores.reduce((a, b) => a + b, 0)
  const avg = sum / scores.length
  return Number.isFinite(avg) ? Math.round(avg * 10) / 10 : 0
}

export function classifyStage(team: TeamProfile): { 
  stage: string, 
  level: number, 
  override: string | null,
  p9Bonus: boolean 
} {
  const p1 = calculateParameterAverage(team, 'p1') || 0
  const p3 = calculateParameterAverage(team, 'p3') || 0
  const p7 = calculateParameterAverage(team, 'p7') || 0
  const p6_stage = team.p6_revenue_stage || ''
  
  let detectedLevel = 0 // Stage 1: IDEA

  // Trigger Logic
  if (p1 >= 2.0) detectedLevel = 1 // Stage 2: PSF
  if (p3 >= 2.0) detectedLevel = 2 // Stage 3: VALIDATION
  if (p7 >= 1.0) detectedLevel = 3 // Stage 4: MVP/PRE-REVENUE
  if (p6_stage.toLowerCase().includes('revenue')) detectedLevel = 4 // Stage 5: REVENUE
  
  // Specific Growth Check (P7 Retention/Growth)
  const p7_retention = Number(team.p7_retention_score) || 0
  const p7_growth = Number(team.p7_growth_score) || 0
  if (detectedLevel >= 4 && (p7_retention > 4.0 && p7_growth > 4.0)) {
    detectedLevel = 5 // Stage 6: GROWTH
  }

  // WEAKEST LINK OVERRIDES
  let override: string | null = null
  const p8 = calculateParameterAverage(team, 'p8') || 0

  // Rule 1: P1 < 2 caps at IDEA
  if (p1 < 2.0 && detectedLevel > 0) {
    detectedLevel = 0
    override = 'P1 Problem Clarity'
  }

  // Rule 2: P3 < 2 caps at PSF
  if (p3 < 2.0 && detectedLevel > 1) {
    detectedLevel = 1
    override = 'P3 Technical TRL'
  }

  // Rule 3: P8 < 2 caps one level below
  if (p8 < 2.0 && detectedLevel > 0) {
    detectedLevel = Math.max(0, detectedLevel - 1)
    if (!override) override = 'P8 Team Readiness'
  }

  return {
    stage: STAGES[detectedLevel] || STAGES[0],
    level: detectedLevel + 1,
    override,
    p9Bonus: detectedLevel >= 3 
  }
}

export function calculateOverallScore(team: TeamProfile): { 
  overall: number, 
  p1: number, p2: number, p3: number, p4: number, p5: number, p6: number, p7: number, p8: number, p9: number,
  isBonusActive: boolean
} {
  const p1 = calculateParameterAverage(team, 'p1') || 0
  const p2 = calculateParameterAverage(team, 'p2') || 0
  const p3 = calculateParameterAverage(team, 'p3') || 0
  const p4 = calculateParameterAverage(team, 'p4') || 0
  const p5 = calculateParameterAverage(team, 'p5') || 0
  const p6 = calculateParameterAverage(team, 'p6') || 0
  const p7 = calculateParameterAverage(team, 'p7') || 0
  const p8 = calculateParameterAverage(team, 'p8') || 0
  const p9 = calculateParameterAverage(team, 'p9') || 0

  const { p9Bonus } = classifyStage(team)

  let weightedSum = 
    (p1 * WEIGHTS.p1) +
    (p2 * WEIGHTS.p2) +
    (p3 * WEIGHTS.p3) +
    (p4 * WEIGHTS.p4) +
    (p5 * WEIGHTS.p5) +
    (p6 * WEIGHTS.p6) +
    (p7 * WEIGHTS.p7) +
    (p8 * WEIGHTS.p8) +
    (p9 * WEIGHTS.p9);

  if (p9Bonus) {
    weightedSum += (p9 * 0.03)
  }

  const overall = Number.isFinite(weightedSum) ? Math.round(weightedSum * 10) / 10 : 0

  return {
    overall,
    p1, p2, p3, p4, p5, p6, p7, p8, p9,
    isBonusActive: !!p9Bonus
  }
}

export function scoreColor(score: number | null): string {
  if (score === null || score === 0) return '#8A9BB0' 
  if (score >= 4.0) return '#1A7A6E' 
  if (score >= 3.0) return '#E8A020' 
  return '#E84B3A' 
}

export function scoreBg(score: number | null): string {
  if (score === null || score === 0) return '#F4F6F9' 
  if (score >= 4.0) return '#D8F0ED' 
  if (score >= 3.0) return '#FDF3DC' 
  return '#FDECEA' 
}

export function scoreLabel(score: number | null): string {
  if (score === null || score === 0) return 'Not Scored'
  if (score >= 4.5) return 'Exceptional'
  if (score >= 4.0) return 'Strong / Ready'
  if (score >= 3.0) return 'Developing / Potential'
  if (score >= 2.0) return 'Initial / Early'
  return 'Gaps Identified'
}

export function getMentorType(stage: string): string {
  const s = stage.toUpperCase()
  if (s.includes('IDEA')) return 'Ideation & Discovery Coach'
  if (s.includes('PROBLEM-SOLUTION')) return 'Product-Design Mentor'
  if (s.includes('VALIDATION')) return 'Market Validation Expert'
  if (s.includes('MVP')) return 'Tech & Operations Specialist'
  if (s.includes('REVENUE')) return 'Business Strategy & Growth Mentor'
  if (s.includes('GROWTH')) return 'Scale & Fundraising Lead'
  return 'General Startup Mentor'
}

export function getRoadmap(team: TeamProfile): any[] {
  const { level } = classifyStage(team)
  
  // 4-Week Sprint Roadmap Logic based on Stage Level
  if (level <= 1) return [
    { priority: 'P1', action: 'Define core problem & why us', supportFrom: 'Discovery Coach', byWhen: 'Week 1' },
    { priority: 'P2', action: 'Conduct 10+ stakeholder discovery interviews', supportFrom: 'Lead Mentor', byWhen: 'Week 2-3' },
    { priority: 'P1', action: 'Synthesize key insights into value prop', supportFrom: 'Incubation Team', byWhen: 'Week 4' },
  ]
  if (level === 2) return [
    { priority: 'P3', action: 'Identify critical TRL gap & tech risk', supportFrom: 'Tech Mentor', byWhen: 'Week 1-2' },
    { priority: 'P4', action: 'Competitor deep dive & differentiation audit', supportFrom: 'Incubation Lead', byWhen: 'Week 3' },
    { priority: 'P2', action: 'Validate solution w/ 5 potential users', supportFrom: 'Market Expert', byWhen: 'Week 4' },
  ]
  if (level === 3) return [
    { priority: 'P5', action: 'Build GTM strategy for initial ICP', supportFrom: 'Strategy Lead', byWhen: 'Week 1-2' },
    { priority: 'P6', action: 'Draft Business Model Canvas V1', supportFrom: 'Finance Mentor', byWhen: 'Week 3' },
    { priority: 'P3', action: 'Scope MVP feature lock set', supportFrom: 'Tech Lead', byWhen: 'Week 4' },
  ]
  if (level >= 4) return [
    { priority: 'P7', action: 'Define core retention loop & NORTH STAR', supportFrom: 'Ops Lead', byWhen: 'Week 1' },
    { priority: 'P6', action: 'Test pricing & unit economic model', supportFrom: 'Strategic Finance', byWhen: 'Week 2-3' },
    { priority: 'P9', action: 'Build defensibility & switching cost map', supportFrom: 'Advisory Board', byWhen: 'Week 4' },
  ]
  return []
}
