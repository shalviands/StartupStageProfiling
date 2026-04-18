'use client'

import React from 'react'
import SectionWrapper from './SectionWrapper'
import DiagnosticField from './DiagnosticField'
import ScoreDots from './ScoreDots'
import { PARAMETERS_CONFIG } from '@/config/parameters'
import type { TeamProfile } from '@/types/team.types'

interface Props {
  data: TeamProfile
  onChange: (field: string, value: any) => void
  readOnlyScores?: boolean
}

const SCORE_TO_CRL: Record<number, number> = {
  1: 2,
  2: 4,
  3: 6,
  4: 8,
  5: 9,
}

const CRL_TO_SCORE: Record<number, number> = {
  1: 1, 2: 1,
  3: 2, 4: 2,
  5: 3, 6: 3,
  7: 4, 8: 4,
  9: 5,
}

export default function Section7Traction({ data, onChange, readOnlyScores = false }: Props) {
  const config = PARAMETERS_CONFIG[6] // p7
  const crlQ = config.coreQs.find(q => q.id === 'crl')
  const otherCoreQs = config.coreQs.filter(q => q.id !== 'crl')

  const currentScore = data.p7_crl_score || 0
  const currentCRL = data.p7_crl 
    ? (typeof data.p7_crl === 'number' ? data.p7_crl : parseInt(String(data.p7_crl))) 
    : (currentScore > 0 ? SCORE_TO_CRL[currentScore] : '')

  const updateCRL = (crlVal: number) => {
    const score = CRL_TO_SCORE[crlVal] || 0
    onChange('p7_crl', crlVal)
    onChange('p7_crl_score', score)
  }

  const updateScore = (scoreVal: number) => {
    const crl = SCORE_TO_CRL[scoreVal] || 0
    onChange('p7_crl_score', scoreVal)
    if (crl) onChange('p7_crl', crl)
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
      {/* Custom CRL Field Implementation */}
      <div className="space-y-4 bg-white border border-rule p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group relative">
        <div className="flex justify-between items-start">
          <label className="text-[10px] font-black text-navy uppercase tracking-widest flex items-center gap-2 pl-1">
            CRL Level / Score
          </label>
          <ScoreDots 
            value={currentScore} 
            onChange={updateScore} 
            readOnly={readOnlyScores}
          />
        </div>
        <div className="relative">
          <select
            value={currentCRL}
            onChange={(e) => updateCRL(parseInt(e.target.value))}
            className="w-full bg-smoke/50 border border-transparent rounded-xl p-4 text-sm text-navy focus:bg-white focus:border-navy focus:ring-4 focus:ring-navy/5 outline-none appearance-none transition-all"
          >
            <option value="" disabled>Select CRL Level...</option>
            {crlQ?.options?.map((opt, i) => (
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
