'use client'

import React from 'react'
import { Users, FileCheck, BarChart3, Clock } from 'lucide-react'
import { cn } from '@/utils/cn'

interface Stat {
  label: string
  value: string | number
  subValue: string
  icon: React.ElementType
  color: string
}

interface Props {
  stats: {
    totalTeams: number
    avgScore: number
    pendingApprovals: number
    growthRate: string
  }
}

export default function StatCards({ stats }: Props) {
  const items: Stat[] = [
    {
      label: 'Total Ventures',
      value: stats.totalTeams,
      subValue: '+4 this week',
      icon: Users,
      color: 'navy'
    },
    {
      label: 'Avg Diagnosis',
      value: stats.avgScore.toFixed(1),
      subValue: 'Across all P1-P9',
      icon: BarChart3,
      color: 'gold'
    },
    {
      label: 'Pending Reviews',
      value: stats.pendingApprovals,
      subValue: 'Requires attention',
      icon: Clock,
      color: 'coral'
    },
    {
      label: 'Submission Rate',
      value: stats.growthRate,
      subValue: 'Draft to Submitted',
      icon: FileCheck,
      color: 'teal'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white border border-rule p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-black text-silver uppercase tracking-widest mb-1.5">{item.label}</p>
              <h3 className="text-3xl font-black text-navy tracking-tight mb-1">{item.value}</h3>
              <p className="text-[10px] font-bold text-slate/50 uppercase tracking-wider">{item.subValue}</p>
            </div>
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
              item.color === 'navy' && "bg-smoke text-navy",
              item.color === 'gold' && "bg-gold-lt text-gold",
              item.color === 'coral' && "bg-coral-lt text-coral",
              item.color === 'teal' && "bg-teal-lt text-teal",
            )}>
              <item.icon size={22} />
            </div>
          </div>
          <div className={cn(
            "absolute bottom-0 left-0 h-1 transition-all duration-500",
            activeClass(item.color)
          )} />
        </div>
      ))}
    </div>
  )
}

function activeClass(color: string) {
  switch (color) {
    case 'navy': return 'bg-navy w-1/4 group-hover:w-full'
    case 'gold': return 'bg-gold w-1/4 group-hover:w-full'
    case 'coral': return 'bg-coral w-1/4 group-hover:w-full'
    case 'teal': return 'bg-teal w-1/4 group-hover:w-full'
    default: return 'bg-navy w-1/4'
  }
}
