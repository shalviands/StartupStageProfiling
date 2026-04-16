'use client'

import React from 'react'
import type { TeamProfile } from '@/types/team.types'
import ScoreDots from './ScoreDots'

interface Props {
  team: TeamProfile
  onScoreChange: (field: keyof TeamProfile, value: number) => void
  onChange: (field: keyof TeamProfile, value: string) => void
}

export default function Section6Pitch({ team, onScoreChange, onChange }: Props) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-white p-8 rounded-3xl border border-rule shadow-sm divide-y divide-smoke">
        <div className="pb-10">
          <ScoreDots 
            label="Pitch Deck & Experience" 
            value={team.pitchDeckScore} 
            onChange={(v) => onScoreChange('pitchDeckScore', v)} 
          />
          <div className="mt-4 space-y-2">
            <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Deck Feedback</label>
            <textarea 
              value={team.pitchDeckDetails}
              onChange={(e) => onChange('pitchDeckDetails', e.target.value)}
              className="w-full bg-smoke/50 border border-rule rounded-2xl p-5 text-sm text-navy min-h-[100px] focus:ring-4 focus:ring-navy/5 focus:border-navy focus:bg-white outline-none transition-all"
              placeholder="Feedback on storytelling flow, visual design, and data clarity."
            />
          </div>
        </div>

        <div className="py-10">
          <ScoreDots 
            label="Elevator Pitch (60 sec)" 
            value={team.elevatorScore} 
            onChange={(v) => onScoreChange('elevatorScore', v)} 
          />
          <div className="mt-4 space-y-2">
            <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Verbal Communication</label>
            <textarea 
              value={team.elevatorDetails}
              onChange={(e) => onChange('elevatorDetails', e.target.value)}
              className="w-full bg-smoke/50 border border-rule rounded-2xl p-5 text-sm text-navy min-h-[100px] focus:ring-4 focus:ring-navy/5 focus:border-navy focus:bg-white outline-none transition-all"
              placeholder="How well did they capture attention in 60 seconds? Is the core hook strong?"
            />
          </div>
        </div>

        <div className="pt-10">
          <ScoreDots 
            label="Investor Ask Clarity" 
            value={team.investorAskScore} 
            onChange={(v) => onScoreChange('investorAskScore', v)} 
          />
          <div className="mt-4 space-y-2">
            <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Milestones & Needs</label>
            <textarea 
              value={team.investorAskDetails}
              onChange={(e) => onChange('investorAskDetails', e.target.value)}
              className="w-full bg-smoke/50 border border-rule rounded-2xl p-5 text-sm text-navy min-h-[100px] focus:ring-4 focus:ring-navy/5 focus:border-navy focus:bg-white outline-none transition-all"
              placeholder="Is the 'ask' specific? Do they know exactly what they need next (funding, mentor, pilot)?"
            />
          </div>
        </div>
      </div>

    </div>
  )
}
