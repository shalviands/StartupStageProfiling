import type { TeamProfile } from '@/types/team.types'

export interface TeamScores {
  problem: number | null
  market:  number | null
  biz:     number | null
  pitch:   number | null
  overall: number | null
}

/**
 * Calculates diagnostic scores based on the team profile.
 * Excludes zeros from average (unscored != 0).
 */
export function calculateScores(team: TeamProfile): TeamScores {
  const avg = (keys: (keyof TeamProfile)[]): number | null => {
    const values = keys
      .map(k => Number(team[k]) || 0)
      .filter(v => v > 0)
    
    if (!values.length) return null
    
    const sum = values.reduce((a, b) => a + b, 0)
    return Math.round((sum / values.length) * 10) / 10
  }

  const problem = avg(['problemScore', 'solutionScore', 'uniqueValueScore'])
  const market  = avg(['customerInterviewScore', 'competitorScore', 'marketSizeScore'])
  const biz     = avg(['revenueModelScore', 'bmcScore'])
  const pitch   = avg(['pitchDeckScore', 'elevatorScore', 'investorAskScore'])

  const allSections = [problem, market, biz, pitch].filter(
    (v): v is number => v !== null
  )

  const overall = allSections.length
    ? Math.round((allSections.reduce((a, b) => a + b, 0) / allSections.length) * 10) / 10
    : null

  return { problem, market, biz, pitch, overall }
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
  if (score === null || score === 0) return 'Not scored'
  if (score >= 4.0) return 'Strong'
  if (score >= 3.0) return 'Developing'
  return 'Needs Work'
}
