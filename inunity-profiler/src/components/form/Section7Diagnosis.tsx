'use client'

import React from 'react'
import type { TeamProfile, RoadmapItem } from '@/types/team.types'
import { Plus, Trash2, Calendar, UserCheck } from 'lucide-react'
import { cn } from '@/utils/cn'

interface Props {
  team: TeamProfile
  onChange: (field: keyof TeamProfile, value: any) => void
}

export default function Section7Diagnosis({ team, onChange }: Props) {
  const roadmap = team.roadmap || []

  const updateRoadmap = (index: number, updates: Partial<RoadmapItem>) => {
    const newList = [...roadmap]
    newList[index] = { ...newList[index], ...updates }
    onChange('roadmap', newList)
  }

  const addRoadmapItem = () => {
    onChange('roadmap', [...roadmap, { priority: 'P1', action: '', supportFrom: '', byWhen: '' }])
  }

  const removeRoadmapItem = (index: number) => {
    onChange('roadmap', roadmap.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Key Strengths</label>
          <textarea 
            value={team.strengths}
            onChange={(e) => onChange('strengths', e.target.value)}
            className="w-full bg-white border border-rule rounded-2xl p-5 text-sm text-navy min-h-[140px] focus:ring-4 focus:ring-navy/5 focus:border-navy outline-none shadow-sm transition-all"
            placeholder="Highlight the strongest aspects of this startup..."
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Critical Gaps</label>
          <textarea 
            value={team.gaps}
            onChange={(e) => onChange('gaps', e.target.value)}
            className="w-full bg-white border border-rule rounded-2xl p-5 text-sm text-navy min-h-[140px] focus:ring-4 focus:ring-navy/5 focus:border-navy outline-none shadow-sm transition-all"
            placeholder="What needs immediate attention to prevent failure?"
          />
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-rule shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center text-gold">
              <Calendar size={18} />
            </div>
            <h3 className="text-sm font-black text-navy uppercase tracking-widest">Individual Team Roadmap</h3>
          </div>
          <button 
            onClick={addRoadmapItem}
            className="flex items-center gap-2 px-4 py-2 bg-navy text-white text-[10px] font-black rounded-xl hover:bg-navy/90 transition-all uppercase tracking-widest shadow-lg shadow-navy/10"
          >
            <Plus size={14} /> Add Milestone
          </button>
        </div>

        <div className="space-y-3">
          {roadmap.length === 0 ? (
            <div className="py-12 border-2 border-dashed border-smoke rounded-2xl flex flex-col items-center justify-center text-silver gap-2">
               <p className="text-xs font-bold uppercase tracking-widest">No milestones defined</p>
               <button onClick={addRoadmapItem} className="text-navy font-bold text-[10px] hover:underline underline-offset-4">Click to add your first P0 item</button>
            </div>
          ) : roadmap.map((item, index) => (
            <div key={index} className="flex flex-wrap md:flex-nowrap items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300 group">
               <div className="relative">
                 <select 
                   value={item.priority}
                   onChange={(e) => updateRoadmap(index, { priority: e.target.value as any })}
                   className={cn(
                     "w-20 rounded-xl p-3 text-[10px] font-black outline-none border transition-all appearance-none text-center cursor-pointer",
                     item.priority === 'P0' ? 'bg-coral/10 border-coral text-coral shadow-sm shadow-coral/10' : 
                     item.priority === 'P1' ? 'bg-gold/10 border-gold text-gold shadow-sm shadow-gold/10' : 
                     'bg-teal/10 border-teal text-teal shadow-sm shadow-teal/10'
                   )}
                 >
                   <option value="P0">P0</option>
                   <option value="P1">P1</option>
                   <option value="P2">P2</option>
                 </select>
               </div>

               <input 
                 type="text" value={item.action}
                 onChange={(e) => updateRoadmap(index, { action: e.target.value })}
                 placeholder="Action Item / Milestone"
                 className="flex-1 min-w-[200px] bg-smoke/50 border border-rule rounded-xl p-3 text-xs text-navy focus:bg-white focus:border-navy outline-none transition-all font-medium"
               />

               <input 
                 type="text" value={item.supportFrom}
                 onChange={(e) => updateRoadmap(index, { supportFrom: e.target.value })}
                 placeholder="Support Source"
                 className="w-full md:w-40 bg-smoke/50 border border-rule rounded-xl p-3 text-xs text-navy focus:bg-white focus:border-navy outline-none transition-all font-medium"
               />

               <input 
                 type="text" value={item.byWhen}
                 onChange={(e) => updateRoadmap(index, { byWhen: e.target.value })}
                 placeholder="Deadline"
                 className="w-full md:w-32 bg-smoke/50 border border-rule rounded-xl p-3 text-xs text-navy focus:bg-white focus:border-navy outline-none transition-all font-medium"
               />

               <button 
                 onClick={() => removeRoadmapItem(index)}
                 className="p-2.5 text-silver hover:bg-coral-lt hover:text-coral rounded-xl transition-all opacity-0 group-hover:opacity-100"
               >
                 <Trash2 size={16} />
               </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        <div className="bg-white p-6 rounded-3xl border border-rule shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-navy mb-1">
            <UserCheck size={16} />
            <label className="text-[10px] font-bold uppercase tracking-widest px-1">Assigned Mentor</label>
          </div>
          <input 
            type="text" value={team.mentor}
            onChange={(e) => onChange('mentor', e.target.value)}
            className="w-full bg-smoke/50 border border-rule rounded-2xl p-4 text-sm text-navy focus:bg-white focus:border-navy outline-none transition-all font-semibold"
            placeholder="Primary Incubation Mentor"
          />
        </div>
        <div className="bg-white p-6 rounded-3xl border border-rule shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-navy mb-1">
            <Calendar size={16} />
            <label className="text-[10px] font-bold uppercase tracking-widest px-1">Next Follow-up</label>
          </div>
          <input 
            type="date" value={team.nextCheckin}
            onChange={(e) => onChange('nextCheckin', e.target.value)}
            className="w-full bg-smoke/50 border border-rule rounded-2xl p-4 text-sm text-navy focus:bg-white focus:border-navy outline-none transition-all font-semibold uppercase"
          />
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-3xl border border-rule shadow-sm space-y-4">
        <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">Internal Feedback / Programme Notes</label>
        <textarea 
          value={team.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          className="w-full bg-smoke/50 border border-rule rounded-2xl p-6 text-sm text-navy min-h-[140px] focus:bg-white focus:border-navy outline-none transition-all leading-relaxed"
          placeholder="Private notes for the incubation programme team. Not included in client-facing brief."
        />
      </div>

    </div>
  )
}
