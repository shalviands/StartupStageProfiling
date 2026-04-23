'use client'

import React from 'react'
import type { TeamProfile } from '@/types/team.types'

interface Props {
  team: TeamProfile
  onChange: (field: string, value: any) => void
}

export default function Section1BasicInfo({ team, onChange }: Props) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Session Hero */}
      <div className="bg-navy rounded-[32px] p-10 text-white relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90">Profiler Identity</span>
             <h1 className="text-4xl font-black tracking-tight leading-none text-white">Startup Profile</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/90 uppercase tracking-widest px-1">Startup Name</label>
              <input 
                type="text" value={team.startupName}
                onChange={(e) => onChange('startupName', e.target.value)}
                className="w-full bg-white/10 border border-white/30 rounded-2xl p-4 text-sm text-white focus:bg-white/20 focus:ring-1 focus:ring-white/40 outline-none transition-all placeholder:text-silver/70 font-medium"
                placeholder="e.g. AgriFlow Systems"
              />
            </div>
            {/* Team ID / Batch removed from UI as requested to auto-fill */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-1">
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate uppercase tracking-widest px-1 flex items-center gap-2">
            <div className="w-1 h-1 bg-slate-900 rounded-full" /> Primary Sector
          </label>
          <div className="relative">
            <select 
              value={team.sector}
              onChange={(e) => onChange('sector', e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 outline-none shadow-sm appearance-none transition-all"
            >
              <option value="">Select Sector...</option>
              {['Agriculture', 'Healthcare', 'EdTech', 'FinTech', 'Sustainability', 'Hardware', 'SaaS', 'E-Commerce', 'CleanTech', 'Other'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate uppercase tracking-widest px-1 flex items-center gap-2">
            <div className="w-1 h-1 bg-slate-900 rounded-full" /> Institution
          </label>
          <input 
            type="text" value={team.institution}
            onChange={(e) => onChange('institution', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 outline-none shadow-sm transition-all placeholder:text-silver"
            placeholder="e.g. NIT Karnataka"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate uppercase tracking-widest px-1 flex items-center gap-2">
            <div className="w-1 h-1 bg-slate-900 rounded-full" /> Team Size
          </label>
          <input 
            type="text" value={team.teamSize}
            onChange={(e) => onChange('teamSize', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 outline-none shadow-sm transition-all placeholder:text-silver"
            placeholder="e.g. 3 Cofounders"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[32px] p-8 space-y-6 shadow-sm">
        <label className="text-[10px] font-black text-slate uppercase tracking-[0.2em] px-1 block">Profiling Session Metadata</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
             <label className="text-[10px] font-bold text-slate">Interview Date</label>
             <input 
              type="date" value={team.interviewDate}
              onChange={(e) => onChange('interviewDate', e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate">Submitted By (Person filling form)</label>
            <input 
              type="text" value={team.interviewer}
              onChange={(e) => onChange('interviewer', e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none transition-all placeholder:text-silver"
              placeholder="Your Full Name"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
