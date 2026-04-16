'use client'

import React from 'react'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/utils/cn'
import { 
  User, 
  Target, 
  Users, 
  TrendingUp, 
  Rocket, 
  Presentation, 
  Stethoscope 
} from 'lucide-react'

const SECTIONS = [
  { id: 0, label: 'Profile', icon: User },
  { id: 1, label: 'Value', icon: Target },
  { id: 2, label: 'Market', icon: Users },
  { id: 3, label: 'Model', icon: TrendingUp },
  { id: 4, label: 'Readiness', icon: Rocket },
  { id: 5, label: 'Pitch', icon: Presentation },
  { id: 6, label: 'Stage Profile', icon: Stethoscope },
]

export default function SectionTabs() {
  const { activeSection, setSection } = useUIStore()

  return (
    <div className="flex border-b border-slate-200 bg-white overflow-x-auto scrollbar-hide px-6 pt-5 gap-3">
      {SECTIONS.map((s) => {
        const Icon = s.icon
        const isActive = activeSection === s.id
        return (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={cn(
              "flex items-center gap-2.5 px-6 py-3.5 rounded-t-2xl transition-all font-extrabold text-[11px] whitespace-nowrap relative border-b-2 btn-hover",
              isActive 
                ? "bg-slate-50 text-slate-900 border-slate-900 shadow-[0_-4px_12px_-4px_rgba(15,23,42,0.05)]" 
                : "bg-white text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50/50"
            )}
          >
            <Icon size={14} className={isActive ? "text-slate-900" : "text-slate-300"} strokeWidth={isActive ? 2.5 : 2} />
            {s.label.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
