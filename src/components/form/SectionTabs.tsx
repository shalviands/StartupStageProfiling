'use client'

import React from 'react'
import { cn } from '@/utils/cn'

interface Props {
  activeTab: number
  setActiveTab: (tab: number) => void
  overallScore?: number
}

const TABS = [
  { id: 0, label: 'Profile' },
  { id: 1, label: 'P1' },
  { id: 2, label: 'P2' },
  { id: 3, label: 'P3' },
  { id: 4, label: 'P4' },
  { id: 5, label: 'P5' },
  { id: 6, label: 'P6' },
  { id: 7, label: 'P7' },
  { id: 8, label: 'P8' },
  { id: 9, label: 'P9' },
]

export default function SectionTabs({ activeTab, setActiveTab }: Props) {
  return (
    <div className="flex bg-slate-100/50 p-1.5 rounded-[20px] mb-8 overflow-x-auto scrollbar-hide border border-slate-100">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "flex-1 min-w-[80px] py-3 px-4 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all duration-300",
            activeTab === tab.id
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/50 scale-[1.02]"
              : "text-slate-400 hover:text-slate-600 hover:bg-white/40"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
