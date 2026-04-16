'use client'

import React from 'react'
import type { TeamProfile } from '@/types/team.types'

interface Props {
  team: TeamProfile
  onChange: (field: keyof TeamProfile, value: any) => void
  onScoreChange?: (field: keyof TeamProfile, value: number) => void
}

export default function Section1BasicInfo({ team, onChange }: Props) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Startup Name</label>
          <input 
            type="text" value={team.startupName}
            onChange={(e) => onChange('startupName', e.target.value)}
            className="w-full bg-white border border-rule rounded-xl p-4 text-sm text-navy focus:ring-2 focus:ring-navy/10 focus:border-navy outline-none shadow-sm transition-all"
            placeholder="e.g. AgriFlow Systems"
          />
        </div>
        
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Team ID / Name</label>
          <input 
            type="text" value={team.teamName}
            onChange={(e) => onChange('teamName', e.target.value)}
            className="w-full bg-white border border-rule rounded-xl p-4 text-sm text-navy focus:ring-2 focus:ring-navy/10 focus:border-navy outline-none shadow-sm transition-all"
            placeholder="e.g. Batch 04 - Team A"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Primary Sector</label>
          <div className="relative">
            <select 
              value={team.sector}
              onChange={(e) => onChange('sector', e.target.value)}
              className="w-full bg-white border border-rule rounded-xl p-4 text-sm text-navy focus:ring-2 focus:ring-navy/10 focus:border-navy outline-none shadow-sm appearance-none transition-all"
            >
              <option value="">Select Sector...</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Healthcare">Healthcare</option>
              <option value="EdTech">EdTech</option>
              <option value="FinTech">FinTech</option>
              <option value="Sustainability">Sustainability</option>
              <option value="Hardware">Hardware</option>
              <option value="Other">Other (Please Specify)</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-silver">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
          {team.sector === 'Other' && (
            <input 
              type="text" value={team.productTypeOther || ''}
              onChange={(e) => onChange('productTypeOther', e.target.value)}
              className="mt-2 w-full bg-white border border-rule rounded-xl p-4 text-sm text-navy focus:ring-2 focus:ring-navy/10 focus:border-navy outline-none shadow-sm animate-in zoom-in-95 duration-200"
              placeholder="Specify Sector..."
            />
          )}
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Institution</label>
          <input 
            type="text" value={team.institution}
            onChange={(e) => onChange('institution', e.target.value)}
            className="w-full bg-white border border-rule rounded-xl p-4 text-sm text-navy focus:ring-2 focus:ring-navy/10 focus:border-navy outline-none shadow-sm transition-all"
            placeholder="e.g. NIT Karnataka"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Team Size</label>
          <input 
            type="text" value={team.teamSize}
            onChange={(e) => onChange('teamSize', e.target.value)}
            className="w-full bg-white border border-rule rounded-xl p-4 text-sm text-navy focus:ring-2 focus:ring-navy/10 focus:border-navy outline-none shadow-sm transition-all"
            placeholder="e.g. 3 Members"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Interview Log</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
             <input 
              type="date" value={team.interviewDate}
              onChange={(e) => onChange('interviewDate', e.target.value)}
              className="w-full bg-white border border-rule rounded-xl p-4 text-sm text-navy focus:ring-2 focus:ring-navy/10 focus:border-navy outline-none shadow-sm transition-all"
            />
          </div>
          <input 
            type="text" value={team.interviewer}
            onChange={(e) => onChange('interviewer', e.target.value)}
            className="w-full bg-white border border-rule rounded-xl p-4 text-sm text-navy focus:ring-2 focus:ring-navy/10 focus:border-navy outline-none shadow-sm transition-all"
            placeholder="Interviewer Name"
          />
        </div>
      </div>
    </div>
  )
}
