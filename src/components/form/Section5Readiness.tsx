'use client'

import React from 'react'
import type { TeamProfile } from '@/types/team.types'

interface Props {
  team: TeamProfile
  onChange: (field: keyof TeamProfile, value: any) => void
  onScoreChange?: (field: keyof TeamProfile, value: number) => void
}

export default function Section5Readiness({ team, onChange }: Props) {
  const levels = [
    { key: 'trl', label: 'TRL (Technology)', color: 'bg-navy' },
    { key: 'brl', label: 'BRL (Business)', color: 'bg-gold' },
    { key: 'crl', label: 'CRL (Customer)', color: 'bg-teal' },
  ]

  const getInterpretation = (val: string) => {
    const v = parseInt(val)
    if (isNaN(v)) return "Not Assessed"
    if (v <= 2) return "Ideation / Concept"
    if (v <= 4) return "Validation / Prototyping"
    if (v <= 6) return "Pilot / Production Prep"
    if (v <= 8) return "Market Ready / Scaling"
    return "Mature / Established"
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {levels.map((lvl) => (
        <div key={lvl.key} className="bg-white p-8 rounded-3xl border border-rule shadow-sm space-y-8 group transition-all hover:border-navy/10 hover:shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-1">{lvl.label}</h3>
              <p className="text-xs text-silver">Current maturity: <span className="text-navy font-bold">Level {team[lvl.key as 'trl' | 'brl' | 'crl'] || '?'}</span></p>
            </div>
            <div className={cn(
               "px-4 py-2 text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg shadow-navy/10",
               lvl.color
            )}>
              {getInterpretation(team[lvl.key as keyof TeamProfile] as string)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Adjust Level</label>
              <div className="relative">
                <select 
                  value={team[lvl.key as keyof TeamProfile] as string}
                  onChange={(e) => onChange(lvl.key as keyof TeamProfile, e.target.value)}
                  className="w-full bg-smoke/50 border border-rule rounded-2xl h-16 px-6 text-xl font-black text-navy outline-none focus:ring-4 focus:ring-navy/5 focus:border-navy focus:bg-white appearance-none transition-all"
                >
                  <option value="">Select...</option>
                  {[1,2,3,4,5,6,7,8,9].map(n => (
                    <option key={n} value={n}>Level {n}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-silver">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
            <div className="bg-smoke/30 p-6 rounded-2xl border border-rule/50 flex flex-col justify-center min-h-[100px]">
              <p className="text-[9px] uppercase font-bold text-silver tracking-widest mb-2">Stage Insights</p>
              <p className="text-sm text-navy font-semibold leading-relaxed">
                {getInterpretation(team[lvl.key as keyof TeamProfile] as string)}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Modern Scale Guide */}
      <div className="bg-gradient-to-br from-navy to-navy2 p-10 rounded-3xl border border-gold/20 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10">
          <h4 className="text-gold font-black uppercase tracking-[0.3em] text-xs mb-8">Master Maturity Scale (MMS)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            <div className="space-y-2 group">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-gold/30">01</span>
                <span className="text-gold font-black uppercase tracking-widest text-[11px]">Early Stage</span>
              </div>
              <p className="text-silver text-xs leading-relaxed font-medium">Conceptual research, basic principles observed, and solution architecture defined.</p>
            </div>
            <div className="space-y-2 group">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-gold/30">02</span>
                <span className="text-gold font-black uppercase tracking-widest text-[11px]">Validation</span>
              </div>
              <p className="text-silver text-xs leading-relaxed font-medium">Alpha/Beta prototypes built. Simulated environment testing and initial user feedback logs.</p>
            </div>
            <div className="space-y-2 group">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-gold/30">03</span>
                <span className="text-gold font-black uppercase tracking-widest text-[11px]">Market Ready</span>
              </div>
              <p className="text-silver text-xs leading-relaxed font-medium">Final system verification. Live pilot operations and transition to commercial production.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
