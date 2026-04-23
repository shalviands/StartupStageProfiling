import React, { useState } from 'react'
import { cn } from '@/utils/cn'
import { Info, X, Lightbulb, FileText } from 'lucide-react'

interface Question {
  readonly id: string
  readonly label: string
  readonly type: 'text' | 'number' | 'select'
  readonly placeholder?: string
  readonly options?: readonly string[]
  readonly description?: string
  readonly example?: string
}

interface DiagnosticFieldProps {
  parameterId: string
  question: Question
  data: any
  onChange: (field: string, value: any) => void
  readOnlyScores?: boolean
}

export default function DiagnosticField({
  parameterId,
  question,
  data,
  onChange,
  readOnlyScores = false
}: DiagnosticFieldProps) {
  const [showInfo, setShowInfo] = useState(false)
  const fieldName = `${parameterId}_${question.id}`
  const val = data[fieldName] || ''
  const scoreField = `${fieldName}_score`
  const scoreVal = data[scoreField] || 0

  return (
    <div className="space-y-4 bg-white border border-rule p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group relative">
      <div className="flex justify-between items-start">
        <label className="text-[10px] font-black text-navy uppercase tracking-widest flex items-center gap-2 pl-1 cursor-help" onClick={() => setShowInfo(true)}>
          {question.label}
          <div className="w-5 h-5 rounded-lg bg-smoke flex items-center justify-center text-silver group-hover:text-gold transition-colors">
            <Info size={12} />
          </div>
        </label>
        
        {/* Score Dots */}
        {!readOnlyScores && (
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
        )}
      </div>

      {question.type === 'text' && (
        <textarea
          value={val}
          onChange={(e) => onChange(fieldName, e.target.value)}
          placeholder={question.placeholder}
          className="w-full bg-smoke/50 border border-transparent rounded-xl p-4 text-sm text-navy focus:bg-white focus:border-navy focus:ring-4 focus:ring-navy/5 outline-none min-h-[100px] resize-none transition-all placeholder:text-silver font-medium"
        />
      )}

      {question.type === 'number' && (
        <input
          type="number"
          value={val}
          onChange={(e) => onChange(fieldName, e.target.value === '' ? '' : Number(e.target.value))}
          placeholder={question.placeholder}
          className="w-full bg-smoke/50 border border-transparent rounded-xl p-4 text-sm text-navy focus:bg-white focus:border-navy focus:ring-4 focus:ring-navy/5 outline-none transition-all placeholder:text-silver font-medium"
        />
      )}

      {question.type === 'select' && (
        <div className="relative">
          <select
            value={val}
            onChange={(e) => {
              const rawV = e.target.value
              // If it's CRL/TRL, we extract only the digit for clean storage
              const isNumericField = question.id === 'trl' || question.id === 'crl'
              const v = isNumericField ? parseInt(rawV, 10) : rawV
              onChange(fieldName, Number.isNaN(v) ? '' : v)
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

      {/* Info Modal Overlay */}
      {showInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={() => setShowInfo(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl border border-rule animate-in zoom-in-95 duration-300">
            <div className="bg-navy p-8 text-white flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 block mb-2">Expert Context</span>
                <h4 className="text-xl font-black tracking-tight">{question.label}</h4>
              </div>
              <button onClick={() => setShowInfo(false)} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gold font-black uppercase text-[10px] tracking-widest">
                  <Lightbulb size={16} />
                  Guideline
                </div>
                <p className="text-sm font-semibold text-slate tracking-tight leading-relaxed">
                  {question.description || "The evaluator is looking for structural evidence for this specific parameter. Provide concrete details over generalities."}
                </p>
              </div>

              <div className="p-6 bg-smoke rounded-2xl border border-rule space-y-4">
                <div className="flex items-center gap-3 text-navy font-black uppercase text-[10px] tracking-widest">
                  <FileText size={16} />
                  Example Answer
                </div>
                <p className="text-xs font-bold text-navy italic leading-relaxed">
                  "{question.example || "No specific example provided for this field."}"
                </p>
              </div>

              <button 
                onClick={() => setShowInfo(false)}
                className="w-full bg-navy text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-navy/20"
              >
                Got it, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
