'use client'

import React from 'react'
import type { TeamProfile } from '@/types/team.types'
import ScoreDots from './ScoreDots'

interface Props {
  team: TeamProfile
  onScoreChange: (field: keyof TeamProfile, value: number) => void
  onChange: (field: keyof TeamProfile, value: string) => void
}

export default function Section2ProblemSolution({ team, onScoreChange, onChange }: Props) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-white p-8 rounded-3xl border border-rule space-y-6 shadow-sm">
        <div className="flex justify-between items-center">
          <ScoreDots 
            label="Problem Statement" 
            value={team.problemScore} 
            onChange={(v) => onScoreChange('problemScore', v)} 
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Problem Insight</label>
          <textarea 
            value={team.problemStatement}
            onChange={(e) => onChange('problemStatement', e.target.value)}
            className="w-full bg-smoke/50 border border-rule rounded-2xl p-5 text-sm text-navy min-h-[140px] focus:ring-4 focus:ring-navy/5 focus:border-navy focus:bg-white outline-none transition-all"
            placeholder="Describe the specific pain point. Is the user's struggle clearly articulated? Is there evidence of this pain?"
          />
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-rule space-y-8 shadow-sm">
        <div className="flex justify-between items-center">
          <ScoreDots 
            label="Proposed Solution" 
            value={team.solutionScore} 
            onChange={(v) => onScoreChange('solutionScore', v)} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Product Category</label>
            <div className="relative">
              <select 
                value={team.productType}
                onChange={(e) => onChange('productType', e.target.value)}
                className="w-full bg-smoke/50 border border-rule rounded-xl p-4 text-sm text-navy focus:border-navy focus:bg-white focus:ring-4 focus:ring-navy/5 outline-none appearance-none transition-all"
              >
                <option value="">Select Category...</option>
                <option value="SaaS / Software">SaaS / Software</option>
                <option value="Physical Hardware">Physical Hardware</option>
                <option value="Software + Hardware">Software + Hardware</option>
                <option value="Service Marketplace">Service Marketplace</option>
                <option value="Platform">Platform</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-silver">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
          {team.productType === 'Other' && (
            <div className="space-y-2 animate-in zoom-in-95 duration-200">
              <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Specify Type</label>
              <input 
                type="text" value={team.productTypeOther}
                onChange={(e) => onChange('productTypeOther', e.target.value)}
                className="w-full bg-smoke/50 border border-rule rounded-xl p-4 text-sm text-navy focus:border-navy focus:bg-white focus:ring-4 focus:ring-navy/5 outline-none transition-all"
                placeholder="e.g. Deeptech AI"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Solution Description</label>
          <textarea 
            value={team.solutionDescription}
            onChange={(e) => onChange('solutionDescription', e.target.value)}
            className="w-full bg-smoke/50 border border-rule rounded-2xl p-5 text-sm text-navy min-h-[140px] focus:ring-4 focus:ring-navy/5 focus:border-navy focus:bg-white outline-none transition-all"
            placeholder="How does the product address the problem? Is the approach unique or technical? Highlight current-state prototypes."
          />
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-rule space-y-6 shadow-sm">
        <ScoreDots 
          label="Unique Value Proposition (UVP)" 
          value={team.uniqueValueScore} 
          onChange={(v) => onScoreChange('uniqueValueScore', v)} 
        />
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">What's the 'Unfair Advantage'?</label>
          <textarea 
            value={team.uniqueValue}
            onChange={(e) => onChange('uniqueValue', e.target.value)}
            className="w-full bg-smoke/50 border border-rule rounded-2xl p-5 text-sm text-navy min-h-[100px] focus:ring-4 focus:ring-navy/5 focus:border-navy focus:bg-white outline-none transition-all"
            placeholder="Why will customers choose this over competitors? What is the core differentiator?"
          />
        </div>
      </div>

    </div>
  )
}
