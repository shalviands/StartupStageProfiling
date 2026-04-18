'use client'

import React from 'react'
import SectionWrapper from './SectionWrapper'
import DiagnosticField from './DiagnosticField'
import ScoreDots from './ScoreDots'
import { PARAMETERS_CONFIG } from '@/config/parameters'
import type { TeamProfile } from '@/types/team.types'
import { cn } from '@/utils/cn'

interface Props {
  data: TeamProfile
  onChange: (field: string, value: any) => void
  readOnlyScores?: boolean
}

const SCORE_TO_TRL: Record<number, number> = {
  1: 2,
  2: 4,
  3: 6,
  4: 8,
  5: 9,
}

const TRL_TO_SCORE: Record<number, number> = {
  1: 1, 2: 1,
  3: 2, 4: 2,
  5: 3, 6: 3,
  7: 4, 8: 4,
  9: 5,
}

export default function Section3ProductTRL({ data, onChange, readOnlyScores = false }: Props) {
  const config = PARAMETERS_CONFIG[2] // p3
  const trlQ = config.coreQs.find(q => q.id === 'trl')
  const otherCoreQs = config.coreQs.filter(q => q.id !== 'trl')

  const currentScore = data.p3_trl_score || 0
  const currentTRL = data.p3_trl 
    ? (typeof data.p3_trl === 'number' ? data.p3_trl : parseInt(String(data.p3_trl))) 
    : (currentScore > 0 ? SCORE_TO_TRL[currentScore] : '')

  const updateTRL = (trlVal: number) => {
    const score = TRL_TO_SCORE[trlVal] || 0
    onChange('p3_trl', trlVal)
    onChange('p3_trl_score', score)
  }

  const updateScore = (scoreVal: number) => {
    const trl = SCORE_TO_TRL[scoreVal] || 0
    onChange('p3_trl_score', scoreVal)
    if (trl) onChange('p3_trl', trl)
  }

  return (
    <SectionWrapper
      parameterId={config.id}
      title={config.title}
      subtitle={config.subtitle}
      weight={config.weight}
      data={data}
      onChange={onChange}
      readOnlyScores={readOnlyScores}
      deepDive={
        <>
          {config.deepDiveQs.map(q => (
            <DiagnosticField
              key={q.id}
              parameterId={config.id}
              question={q as any}
              data={data}
              onChange={onChange}
              readOnlyScores={readOnlyScores}
            />
          ))}
        </>
      }
    >
      {/* Custom TRL Field Implementation */}
      <div className="space-y-4 bg-white border border-rule p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group relative">
        <div className="flex justify-between items-start">
          <label className="text-[10px] font-black text-navy uppercase tracking-widest flex items-center gap-2 pl-1">
            TRL Level / Score
          </label>
          <ScoreDots 
            value={currentScore} 
            onChange={updateScore} 
            readOnly={readOnlyScores}
          />
        </div>
        <div className="relative">
          <select
            value={currentTRL}
            onChange={(e) => updateTRL(parseInt(e.target.value))}
            className="w-full bg-smoke/50 border border-transparent rounded-xl p-4 text-sm text-navy focus:bg-white focus:border-navy focus:ring-4 focus:ring-navy/5 outline-none appearance-none transition-all"
          >
            <option value="" disabled>Select TRL Level...</option>
            {trlQ?.options?.map((opt, i) => (
              <option key={opt} value={i + 1}>{opt}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-silver">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </div>

      {otherCoreQs.map(q => (
        <DiagnosticField
          key={q.id}
          parameterId={config.id}
          question={q as any}
          data={data}
          onChange={onChange}
          readOnlyScores={readOnlyScores}
        />
      ))}
    </SectionWrapper>
  )
}
