'use client'

import React from 'react'
import { PARAMETERS_CONFIG } from '@/config/parameters'
import { TeamProfile } from '@/types/team.types'
import { cn } from '@/utils/cn'

interface ProgressTrackerProps {
  team: TeamProfile
  activeSection: number
}

export default function ProgressTracker({ team, activeSection }: ProgressTrackerProps) {
  const progress = PARAMETERS_CONFIG.map((param, idx) => {
    const totalQs = param.coreQs.length
    let answered = 0
    param.coreQs.forEach(q => {
      // Check if team has a value > 0 for this question's score field
      const scoreField = `${param.id}_${q.id}_score`
      if ((team as any)[scoreField] > 0) answered++
    })
    
    return {
      id: param.id,
      title: param.title,
      percent: Math.round((answered / totalQs) * 100),
      isComplete: answered === totalQs,
      isActive: activeSection === idx + 1
    }
  })

  const overallPercent = Math.round(
    progress.reduce((acc, p) => acc + p.percent, 0) / progress.length
  )

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 mb-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Profiling Progress</span>
          <h3 className="text-xl font-black text-slate-900">{overallPercent}% Complete</h3>
        </div>
        <div className="flex items-center gap-1.5">
          {progress.map((p, i) => (
            <div 
              key={p.id}
              className={cn(
                "h-1.5 transition-all duration-500 rounded-full",
                p.isComplete ? "bg-emerald-500" : p.percent > 0 ? "bg-amber-400" : "bg-slate-100",
                p.isActive ? "w-8" : "w-1.5"
              )}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
        {progress.map((p, idx) => (
          <div 
            key={p.id}
            className={cn(
              "flex flex-col items-center gap-2 p-2 rounded-xl transition-all",
              p.isActive ? "bg-navy" : "bg-slate-50 border border-slate-100"
            )}
          >
            <span className={cn(
              "text-[9px] font-black uppercase",
              p.isActive ? "text-white" : "text-slate-500"
            )}>
              P{idx + 1}
            </span>
            <div className={cn(
              "text-[10px] font-bold",
              p.isActive ? "text-white" : p.isComplete ? "text-emerald-600" : "text-slate-400"
            )}>
              {p.percent}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
