'use client'

import React from 'react'
import { cn } from '@/utils/cn'

interface Props {
  value: number
  onChange: (val: number) => void
  label?: string
  readOnly?: boolean
}

export default function ScoreDots({ value, onChange, label, readOnly = false }: Props) {
  if (readOnly) return null

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-[10px] font-bold text-silver uppercase tracking-widest px-1">{label}</label>}
      <div className="flex items-center gap-1.5 bg-white border border-rule rounded-xl px-4 py-3 shadow-sm inline-flex w-fit">
        {[1, 2, 3, 4, 5].map((dot) => (
          <button
            key={dot}
            type="button"
            onClick={() => onChange(value === dot ? 0 : dot)}
            className={cn(
              "w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center text-[10px] font-bold",
              value >= dot 
                ? "bg-gold border-gold text-white" 
                : "bg-transparent border-smoke text-silver hover:border-gold/30"
            )}
          >
            {dot}
          </button>
        ))}
      </div>
    </div>
  )
}
