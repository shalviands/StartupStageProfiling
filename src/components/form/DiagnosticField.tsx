'use client'

import React from 'react'
import { cn } from '@/utils/cn'
import { Info } from 'lucide-react'

interface Question {
  readonly id: string
  readonly label: string
  readonly type: 'text' | 'number' | 'select'
  readonly placeholder?: string
  readonly options?: readonly string[]
}

interface DiagnosticFieldProps {
  parameterId: string
  question: Question
  data: any
  onChange: (field: string, value: any) => void
}

export default function DiagnosticField({
  parameterId,
  question,
  data,
  onChange,
}: DiagnosticFieldProps) {
  const fieldName = `${parameterId}_${question.id}`
  const val = data[fieldName] || ''
  const scoreField = `${fieldName}_score`
  const scoreVal = data[scoreField] || 0

  return (
    <div className="space-y-4 bg-white border border-rule p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start">
        <label className="text-[10px] font-black text-navy uppercase tracking-widest flex items-center gap-2 pl-1">
          {question.label}
          <Info size={12} className="text-silver cursor-help" />
        </label>
        
        {/* Score Dots */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange(scoreField, s)}
              className={cn(
                "w-6 h-6 rounded-full text-[10px] font-bold transition-all border",
                scoreVal === s 
                  ? "bg-navy border-navy text-white scale-110 shadow-sm" 
                  : "bg-white border-rule text-silver hover:border-navy hover:text-navy"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {question.type === 'text' && (
        <textarea
          value={val}
          onChange={(e) => onChange(fieldName, e.target.value)}
          placeholder={question.placeholder}
          className="w-full bg-smoke/50 border border-transparent rounded-xl p-4 text-sm text-navy focus:bg-white focus:border-navy focus:ring-4 focus:ring-navy/5 outline-none min-h-[100px] resize-none transition-all placeholder:text-silver/50"
        />
      )}

      {question.type === 'number' && (
        <input
          type="number"
          value={val}
          onChange={(e) => onChange(fieldName, Number(e.target.value))}
          placeholder={question.placeholder}
          className="w-full bg-smoke/50 border border-transparent rounded-xl p-4 text-sm text-navy focus:bg-white focus:border-navy focus:ring-4 focus:ring-navy/5 outline-none transition-all placeholder:text-silver/50"
        />
      )}

      {question.type === 'select' && (
        <div className="relative">
          <select
            value={val}
            onChange={(e) => {
              const v = (question.id === 'trl' || question.id === 'crl') ? Number(e.target.value) : e.target.value
              onChange(fieldName, v)
            }}
            className="w-full bg-smoke/50 border border-transparent rounded-xl p-4 text-sm text-navy focus:bg-white focus:border-navy focus:ring-4 focus:ring-navy/5 outline-none appearance-none transition-all"
          >
            <option value="">Select Option...</option>
            {question.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-silver">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      )}
    </div>
  )
}
