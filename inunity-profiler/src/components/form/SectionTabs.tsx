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
  { id: 6, label: 'Diagnosis', icon: Stethoscope },
]

export default function SectionTabs() {
  const { activeSection, setSection } = useUIStore()

  return (
    <div className="flex border-b border-rule bg-white overflow-x-auto scrollbar-hide px-4 pt-4 gap-2">
      {SECTIONS.map((s) => {
        const Icon = s.icon
        const isActive = activeSection === s.id
        return (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-t-xl transition-all font-bold text-xs whitespace-nowrap relative border-b-2",
              isActive 
                ? "bg-smoke text-navy border-navy" 
                : "bg-white text-silver border-transparent hover:text-slate hover:bg-smoke/50"
            )}
          >
            <Icon size={14} className={isActive ? "text-navy" : "text-silver"} />
            {s.label}
          </button>
        )
      })}
    </div>
  )
}
