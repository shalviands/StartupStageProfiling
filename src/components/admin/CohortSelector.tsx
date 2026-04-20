'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LayoutGrid, ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

interface CohortSelectorProps {
  cohorts: { id: string, name: string }[]
  activeCohortId: string | null
}

export default function CohortSelector({ cohorts, activeCohortId }: CohortSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  if (cohorts.length <= 1 && !activeCohortId) return null

  function handleSelect(id: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('cohortId', id)
    router.push(`?${params.toString()}`)
  }

  const activeCohort = cohorts.find(c => c.id === activeCohortId) || cohorts[0]

  return (
    <div className="flex items-center gap-3 bg-white border border-rule rounded-2xl p-1.5 shadow-sm">
      <div className="flex items-center gap-3 pl-3 pr-2 py-1 text-silver border-r border-rule">
        <LayoutGrid size={16} />
        <span className="text-[10px] font-black uppercase tracking-widest">Active Cohort</span>
      </div>
      <div className="relative min-w-[200px]">
        <select 
          value={activeCohortId || cohorts[0]?.id}
          onChange={(e) => handleSelect(e.target.value)}
          className="w-full bg-smoke border-none rounded-xl py-2 pl-4 pr-10 text-[11px] font-black uppercase tracking-widest text-navy outline-none cursor-pointer hover:bg-rule/30 transition-all appearance-none"
        >
          {cohorts.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-silver">
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  )
}
