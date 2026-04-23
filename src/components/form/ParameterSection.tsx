'use client'

import React from 'react'
import { cn } from '@/utils/cn'
import { Info, Lock, ChevronRight, MessageSquare, Plus, Trash2, Zap } from 'lucide-react'
import type { TeamProfile } from '@/types/team.types'
import { calculateParameterAverage, classifyStage } from '@/utils/scores'

interface Question {
  readonly id: string
  readonly label: string
  readonly type: 'text' | 'number' | 'select' | 'team'
  readonly placeholder?: string
  readonly options?: readonly string[]
}

interface ParameterSectionProps {
  parameterId: string // p1, p2, etc.
  title: string
  subtitle: string
  weight: string
  coreQs: readonly Question[]
  deepDiveQs: readonly Question[]
  data: TeamProfile
  onChange: (field: string, value: any) => void
  hideObservation?: boolean
}

export default function ParameterSection({
  parameterId,
  title,
  subtitle,
  weight,
  coreQs,
  deepDiveQs,
  data,
  onChange,
  hideObservation = false
}: ParameterSectionProps) {
  const { level } = classifyStage(data)
  const isDeepDiveUnlocked = level >= 3
  const avg = calculateParameterAverage(data, parameterId)

  const renderField = (q: Question) => {
    const fieldName = `${parameterId}_${q.id}`
    const val = (data as any)[fieldName] || ''
    const scoreField = `${fieldName}_score`
    const scoreVal = (data as any)[scoreField] || 0

    return (
      <div key={q.id} className="space-y-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
        <div className="flex justify-between items-start">
          <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            {q.label}
            <Info size={12} className="text-slate-500 cursor-help" />
          </label>
          
          {/* Score Dots */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => onChange(scoreField, s)}
                className={cn(
                  "w-6 h-6 rounded-full text-[10px] font-bold transition-all border",
                  scoreVal === s 
                    ? "bg-slate-950 border-slate-950 text-white scale-110 shadow-sm" 
                    : "bg-white border-slate-300 text-slate-600 hover:border-slate-500"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {q.type === 'text' && (
          <textarea
            value={val}
            onChange={(e) => onChange(fieldName, e.target.value)}
            placeholder={q.placeholder}
            className="w-full bg-slate-50/50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-slate-900 min-h-[100px] resize-none"
          />
        )}

        {q.type === 'number' && (
          <input
            type="number"
            value={val}
            onChange={(e) => onChange(fieldName, Number(e.target.value))}
            className="w-full bg-slate-50/50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-slate-900"
          />
        )}

        {q.type === 'select' && (
          <select
            value={val}
            onChange={(e) => onChange(fieldName, q.id === 'trl' || q.id === 'crl' ? Number(e.target.value) : e.target.value)}
            className="w-full bg-slate-50/50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-slate-900 appearance-none"
          >
            <option value="">Select Option...</option>
            {q.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}
      </div>
    )
  }

  // Specialized Team Member Renderer for P8
  const renderTeamMembers = () => {
    const members = data.p8_team_members || []
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((m: any, idx: number) => (
            <div key={idx} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm relative group overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => {
                    const newMembers = [...members]
                    newMembers.splice(idx, 1)
                    onChange('p8_team_members', newMembers)
                  }}
                  className="text-rose-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <input 
                className="w-full font-bold text-slate-800 text-sm mb-2 focus:outline-none" 
                placeholder="Name" 
                value={m.name} 
                onChange={(e) => {
                  const items = [...members]
                  items[idx].name = e.target.value
                  onChange('p8_team_members', items)
                }}
              />
              <div className="flex gap-4">
                <input 
                  className="flex-1 text-xs text-slate-700 font-semibold focus:outline-none" 
                  placeholder="Role (e.g. CEO)" 
                  value={m.role}
                  onChange={(e) => {
                    const items = [...members]
                    items[idx].role = e.target.value
                    onChange('p8_team_members', items)
                  }}
                />
                <input 
                  className="flex-1 text-xs text-slate-500 focus:outline-none italic" 
                  placeholder="Prior Experience/Skill" 
                  value={m.skill}
                  onChange={(e) => {
                    const items = [...members]
                    items[idx].skill = e.target.value
                    onChange('p8_team_members', items)
                  }}
                />
              </div>
            </div>
          ))}
          <button 
            onClick={() => onChange('p8_team_members', [...members, { name: '', role: '', skill: '' }])}
            className="border-2 border-dashed border-slate-300 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-slate-600 hover:border-slate-500 hover:text-slate-900 transition-all font-bold"
          >
            <Plus size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Add Founder/Core Member</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Parameter Header */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
             <span className="bg-slate-950 text-white text-[10px] font-black px-2.5 py-1 rounded-full">{weight}</span>
          </div>
          <p className="text-sm text-slate-700 font-bold">{subtitle}</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Param Score</div>
          <div className={cn(
            "text-4xl font-black tabular-nums",
            avg >= 4 ? "text-emerald-600" : avg >= 3 ? "text-amber-500" : avg > 0 ? "text-rose-500" : "text-slate-200"
          )}>
            {avg > 0 ? avg.toFixed(1) : '--'}
          </div>
        </div>
      </div>

      {/* Core Questions */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-slate-500">
          <ChevronRight size={16} />
          <span className="text-[11px] font-black uppercase tracking-widest">Core Parameters</span>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {parameterId === 'p8' && renderTeamMembers()}
          {coreQs.map(q => renderField(q))}
        </div>
      </div>

      {/* Deep Dive Questions */}
      <div className={cn(
        "space-y-6 transition-all duration-500 rounded-3xl p-8",
        isDeepDiveUnlocked ? "bg-indigo-50/50" : "bg-slate-50 opacity-60"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-900">
            {isDeepDiveUnlocked ? <Zap size={16} className="text-indigo-600" /> : <Lock size={16} className="text-slate-500" />}
            <span className={cn("text-[11px] font-black uppercase tracking-widest", isDeepDiveUnlocked ? "text-indigo-950" : "text-slate-600")}>
              Deep Dive Analysis
            </span>
          </div>
          {!isDeepDiveUnlocked && (
             <span className="text-[10px] font-bold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-300 shadow-sm">
               Unlock at Validation Stage
             </span>
          )}
        </div>

        {isDeepDiveUnlocked ? (
          <div className="grid grid-cols-1 gap-6">
            {deepDiveQs.map(q => renderField(q))}
          </div>
        ) : (
          <div className="py-8 text-center space-y-2">
            <p className="text-xs font-black text-slate-800">Section Locked</p>
            <p className="text-[10px] text-slate-700 font-bold max-w-xs mx-auto">This section is for validated startups with evidence of Problem-Solution Fit.</p>
          </div>
        )}
      </div>

      {/* Observation Box - Hidden for Startups */}
      {!hideObservation && (
        <div className="bg-navy rounded-3xl p-8 text-white space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <MessageSquare size={16} />
            </div>
            <div>
              <h4 className="text-sm font-bold">Profiler Observation</h4>
              <p className="text-[10px] text-white/70 font-medium">Summarize key evidence or risks for this parameter</p>
            </div>
          </div>
          <textarea
            value={(data as any)[`${parameterId}_observation`] || ''}
            onChange={(e) => onChange(`${parameterId}_observation`, e.target.value)}
            placeholder={`Enter mentor observations for ${title}...`}
            className="w-full bg-white/5 border border-white/20 rounded-2xl p-6 text-sm text-white placeholder:text-white/40 focus:ring-1 focus:ring-white/30 min-h-[120px] resize-none"
          />
        </div>
      )}
    </div>
  )
}
