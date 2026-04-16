'use client'

import React from 'react'
import type { TeamProfile } from '@/types/team.types'
import ScoreDots from './ScoreDots'

interface Props {
  team: TeamProfile
  onScoreChange: (field: keyof TeamProfile, value: number) => void
  onChange: (field: keyof TeamProfile, value: string) => void
}

export default function Section4BusinessModel({ team, onScoreChange, onChange }: Props) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-white p-8 rounded-3xl border border-rule space-y-8 shadow-sm">
        <div className="flex justify-between items-center">
          <ScoreDots 
            label="Revenue Model" 
            value={team.revenueModelScore} 
            onChange={(v) => onScoreChange('revenueModelScore', v)} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Revenue Stage</label>
            <div className="relative">
              <select 
                value={team.revenueStage}
                onChange={(e) => onChange('revenueStage', e.target.value)}
                className="w-full bg-smoke/50 border border-rule rounded-xl p-4 text-sm text-navy focus:border-navy focus:bg-white focus:ring-4 focus:ring-navy/5 outline-none appearance-none transition-all"
              >
                <option value="">Select Stage...</option>
                <option value="Idea">Idea Stage</option>
                <option value="Pre-Revenue MVP">Pre-Revenue MVP</option>
                <option value="Early Revenue">Early Revenue</option>
                <option value="Scaling">Scaling / Growth</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-silver">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Business Model Type</label>
            <div className="relative">
              <select 
                value={team.businessModelType}
                onChange={(e) => onChange('businessModelType', e.target.value)}
                className="w-full bg-smoke/50 border border-rule rounded-xl p-4 text-sm text-navy focus:border-navy focus:bg-white focus:ring-4 focus:ring-navy/5 outline-none appearance-none transition-all"
              >
                <option value="">Select Model...</option>
                <option value="Direct Sales">Direct Sales</option>
                <option value="Subscription">Subscription (SaaS)</option>
                <option value="Marketplace">Marketplace / Commission</option>
                <option value="B2B Supply">B2B Supply Chain</option>
                <option value="Ad-based">Ad-based / Traffic</option>
                <option value="Other">Other / Hybrid</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-silver">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Revenue Stream Details</label>
          <textarea 
            value={team.revenueModelDetails}
            onChange={(e) => onChange('revenueModelDetails', e.target.value)}
            className="w-full bg-smoke/50 border border-rule rounded-2xl p-5 text-sm text-navy min-h-[120px] focus:ring-4 focus:ring-navy/5 focus:border-navy focus:bg-white outline-none transition-all"
            placeholder="Explain the unit economics. How does the money flow? What are the key pricing assumptions?"
          />
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-rule space-y-8 shadow-sm">
        <div className="flex justify-between items-center">
          <ScoreDots 
            label="Business Model Canvas (BMC)" 
            value={team.bmcScore} 
            onChange={(v) => onScoreChange('bmcScore', v)} 
          />
          <div className="flex items-center gap-3 bg-smoke/50 px-3 py-1.5 rounded-xl border border-rule">
            <label className="text-[10px] font-bold text-silver uppercase tracking-widest">Status</label>
            <select 
              value={team.bmcDone}
              onChange={(e) => onChange('bmcDone', e.target.value)}
              className="bg-transparent text-xs font-bold text-navy outline-none cursor-pointer"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Draft Complete">Draft Complete</option>
              <option value="Finalized">Finalized</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">BMC Evaluation</label>
          <textarea 
            value={team.bmcDetails}
            onChange={(e) => onChange('bmcDetails', e.target.value)}
            className="w-full bg-smoke/50 border border-rule rounded-2xl p-5 text-sm text-navy min-h-[140px] focus:ring-4 focus:ring-navy/5 focus:border-navy focus:bg-white outline-none transition-all"
            placeholder="Evaluate the coherence of the canvas. Are key partners and resources accurately identified?"
          />
        </div>
      </div>

    </div>
  )
}
