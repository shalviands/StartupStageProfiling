'use client'

import React from 'react'
import type { TeamProfile } from '@/types/team.types'
import ScoreDots from './ScoreDots'

interface Props {
  team: TeamProfile
  onScoreChange: (field: keyof TeamProfile, value: number) => void
  onChange: (field: keyof TeamProfile, value: any) => void
}

export default function Section3MarketValidation({ team, onScoreChange, onChange }: Props) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Validation Stats Block */}
      <div className="bg-navy p-8 rounded-3xl border border-navy shadow-lg shadow-navy/10 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gold uppercase tracking-widest pl-1">Users Tested With</label>
            <input 
              type="text" 
              value={team.usersTested}
              onChange={(e) => onChange('usersTested', Number(e.target.value) || 0)}
              className="w-full bg-white/10 border border-white/20 rounded-xl h-12 px-4 text-white font-bold focus:bg-white/20 focus:border-white/40 outline-none transition-all"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gold uppercase tracking-widest pl-1">Stakeholder Interactions</label>
            <input 
              type="text" 
              value={team.stakeholdersInteracted}
              onChange={(e) => onChange('stakeholdersInteracted', Number(e.target.value) || 0)}
              className="w-full bg-white/10 border border-white/20 rounded-xl h-12 px-4 text-white font-bold focus:bg-white/20 focus:border-white/40 outline-none transition-all"
              placeholder="0"
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label className="text-[10px] font-bold text-gold uppercase tracking-widest pl-1">Stakeholder Types</label>
            <input 
              type="text" 
              value={team.stakeholderTypes}
              onChange={(e) => onChange('stakeholderTypes', e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl h-12 px-4 font-medium focus:bg-white/20 focus:border-white/40 outline-none transition-all placeholder:text-white/30"
              placeholder="e.g. Farmers, Retailers, NGOs"
            />
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <label className="text-[10px] font-bold text-gold uppercase tracking-widest pl-1">Key Validation Findings</label>
          <textarea 
            value={team.testingDetails}
            onChange={(e) => onChange('testingDetails', e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-2xl p-5 text-sm min-h-[120px] focus:bg-white/20 focus:border-white/40 outline-none transition-all placeholder:text-white/30"
            placeholder="What were the biggest takeaways from these tests? Did anything surface that requires a pivot?"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-rule space-y-6 shadow-sm">
          <ScoreDots 
            label="Customer Validation" 
            value={team.customerInterviewScore} 
            onChange={(v) => onScoreChange('customerInterviewScore', v)} 
          />
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Interview Insights</label>
            <textarea 
              value={team.customerInterviewDetails}
              onChange={(e) => onChange('customerInterviewDetails', e.target.value)}
              className="w-full bg-smoke/50 border border-rule rounded-2xl p-5 text-sm text-navy min-h-[160px] focus:ring-4 focus:ring-navy/5 focus:border-navy focus:bg-white outline-none transition-all"
              placeholder="How many were interviewed? What were the key insights?"
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-rule space-y-6 shadow-sm">
          <ScoreDots 
            label="Competitor Awareness" 
            value={team.competitorScore} 
            onChange={(v) => onScoreChange('competitorScore', v)} 
          />
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Competitive Landscape</label>
            <textarea 
              value={team.competitorDetails}
              onChange={(e) => onChange('competitorDetails', e.target.value)}
              className="w-full bg-smoke/50 border border-rule rounded-2xl p-5 text-sm text-navy min-h-[160px] focus:ring-4 focus:ring-navy/5 focus:border-navy focus:bg-white outline-none transition-all"
              placeholder="List direct and indirect competitors. What is our technical or business moat?"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-rule space-y-6 shadow-sm">
        <ScoreDots 
          label="Market Size (TAM/SAM/SOM)" 
          value={team.marketSizeScore} 
          onChange={(v) => onScoreChange('marketSizeScore', v)} 
        />
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Market Reach</label>
          <textarea 
            value={team.marketSizeDetails}
            onChange={(e) => onChange('marketSizeDetails', e.target.value)}
            className="w-full bg-smoke/50 border border-rule rounded-2xl p-5 text-sm text-navy min-h-[100px] focus:ring-4 focus:ring-navy/5 focus:border-navy focus:bg-white outline-none transition-all"
            placeholder="Quantify the market. What is the reachable scale in the next 12-24 months?"
          />
        </div>
      </div>

    </div>
  )
}
