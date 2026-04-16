'use client'

import React from 'react'
import { cn } from '@/utils/cn'

interface Props {
  activeTab: number
  setActiveTab: (tab: number) => void
  overallScore?: number
}

const TABS = [
  { id: 0, label: 'Metadata' },
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
    <div className="flex bg-smoke p-1.5 rounded-[22px] mb-8 overflow-x-auto scrollbar-hide border border-rule shadow-inner">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "flex-1 min-w-[90px] py-4 px-4 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all duration-300",
            activeTab === tab.id
              ? "bg-navy text-white shadow-lg shadow-navy/20 active:scale-95"
              : "text-silver hover:text-navy hover:bg-white/60"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
