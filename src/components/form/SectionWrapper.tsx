'use client'

import React from 'react'
import { cn } from '@/utils/cn'
import { ChevronRight, MessageSquare, Lock, Zap, ShieldCheck } from 'lucide-react'
import { calculateParameterAverage, classifyStage } from '@/utils/scores'
import type { TeamProfile } from '@/types/team.types'

interface SectionWrapperProps {
  parameterId: string
  title: string
  subtitle: string
  weight: string
  data: TeamProfile
  onChange: (field: string, value: any) => void
  children: React.ReactNode
  deepDive?: React.ReactNode
  hideObservation?: boolean
  readOnlyScores?: boolean
}

export default function SectionWrapper({
  parameterId,
  title,
  subtitle,
  weight,
  data,
  onChange,
  children,
  deepDive,
  hideObservation = true,
  readOnlyScores = false,
}: SectionWrapperProps) {
  const avg = calculateParameterAverage(data, parameterId)
  const isDeepDiveUnlocked = true // Open to all startups as requested

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Parameter Header */}
      <div className="flex justify-between items-end border-b border-rule pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <h2 className="text-3xl font-black text-navy tracking-tight leading-none">{title}</h2>
             {!readOnlyScores && (
               <span className="bg-navy text-gold text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm">
                 {weight} WEIGHT
               </span>
             )}
          </div>
          <p className="text-sm text-slate font-semibold max-w-xl">{subtitle}</p>
        </div>
        
        {!readOnlyScores && (
          <div className="text-right">
            <div className="text-[10px] font-black text-slate uppercase tracking-widest mb-1.5">Parameter Score</div>
            <div className={cn(
              "text-5xl font-black tabular-nums transition-colors duration-500",
              avg >= 4 ? "text-teal" : avg >= 3 ? "text-gold" : avg > 0 ? "text-coral" : "text-smoke"
            )}>
              {avg > 0 ? avg.toFixed(1) : '--'}
            </div>
          </div>
        )}
      </div>

      {/* Core Diagnostics */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-silver">
          <ChevronRight size={16} />
          <span className="text-[11px] font-black uppercase tracking-widest">Core Profiler Evidence</span>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {children}
        </div>
      </div>

      {/* Deep Dive Section */}
      {deepDive && (
        <div className={cn(
          "space-y-6 transition-all duration-700 rounded-[32px] p-10 border bg-purple-lt border-purple/10"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center transition-colors shadow-sm bg-purple text-white"
              )}>
                <Zap size={18} fill="currentColor" />
              </div>
              <div>
                <span className={cn(
                  "text-xs font-black uppercase tracking-widest block text-purple"
                )}>
                  Strategic Deep Dive
                </span>
                <span className="text-[10px] font-bold text-slate/60 block">Advanced risk & moat analysis</span>
              </div>
            </div>
            <div className="bg-white border border-rule px-4 py-2 rounded-2xl shadow-sm text-[10px] font-black text-navy uppercase tracking-wider flex items-center gap-2">
              <Zap size={12} className="text-purple" /> Strategic Insight
            </div>
          </div>

          <div className={cn(
            "grid grid-cols-1 gap-6 transition-all duration-500"
          )}>
            {deepDive}
          </div>
        </div>
      )}

      {/* Observation Box - Hidden for Startups */}
      {!hideObservation && (
        <div className="bg-navy rounded-[32px] p-10 text-white space-y-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 shadow-inner">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-tight">Oversight Observations</h4>
                <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest">Internal high-density evidence summary</p>
              </div>
            </div>
            <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">P{parameterId.slice(1)} LOG</div>
          </div>
          <textarea
            value={(data as any)[`${parameterId}_observation`] || ''}
            onChange={(e) => onChange(`${parameterId}_observation`, e.target.value)}
            placeholder={`Enter strategic observations for ${title}...`}
            className="w-full bg-slate-800/80 border border-white/20 rounded-2xl p-6 text-sm text-white placeholder:text-white/40 focus:bg-slate-800 focus:border-white/40 focus:ring-4 focus:ring-slate-700/50 outline-none min-h-[140px] resize-none transition-all font-medium leading-relaxed"
          />
        </div>
      )}
    </div>
  )
}
