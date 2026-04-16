'use client'

import React from 'react'
import { Sparkles, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAIAnalysis } from '@/hooks/useAIAnalysis'
import { cn } from '@/utils/cn'

interface Props {
  teamId: string
}

export default function AIAnalysisPanel({ teamId }: Props) {
  const { mutate: runAnalysis, data, isPending, error } = useAIAnalysis(teamId)

  return (
    <div className="p-4 bg-smoke/30 flex flex-col gap-4 border-t border-rule min-h-[300px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-purple" />
          <h3 className="text-[10px] font-black text-navy uppercase tracking-widest">AI Incubation Insight</h3>
        </div>
        {data?.model_used && (
          <span className="text-[8px] font-bold text-silver uppercase bg-white px-2 py-0.5 rounded border border-rule">
            {data.model_used.includes('rule-based') ? 'Fallback' : 'AI Gen'}
          </span>
        )}
      </div>

      {!data && !isPending && !error && (
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-inner border border-rule">
            <Sparkles size={20} className="text-silver" />
          </div>
          <p className="text-[10px] font-bold text-silver uppercase tracking-widest leading-relaxed max-w-[160px]">
            Run AI analysis to get incubation pointers
          </p>
          <button 
            onClick={() => runAnalysis()}
            className="mt-2 bg-navy text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-navy/90 transition-all shadow-lg shadow-navy/10"
          >
            Analyse Now
          </button>
        </div>
      )}

      {isPending && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-navy" size={24} />
          <div className="text-[10px] font-black text-navy uppercase tracking-widest animate-pulse">
            Processing Profile...
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-coral-lt border border-coral/20 rounded-2xl flex items-center gap-3">
          <AlertCircle className="text-coral shrink-0" size={16} />
          <p className="text-[10px] font-bold text-coral uppercase leading-tight">
            Analysis Failed. Please check API settings.
          </p>
        </div>
      )}

      {data && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-4">
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[9px] font-black text-teal uppercase tracking-widest">
                <CheckCircle2 size={12} />
                Key Strengths
              </div>
              <p className="text-[11px] text-navy/80 leading-relaxed font-medium bg-white/50 p-3 rounded-xl border border-rule/30">
                {data.strengths}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[9px] font-black text-coral uppercase tracking-widest">
                 <AlertCircle size={12} />
                 Identified Gaps
              </div>
              <p className="text-[11px] text-navy/80 leading-relaxed font-medium bg-white/50 p-3 rounded-xl border border-rule/30">
                {data.gaps}
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-[9px] font-black text-gold uppercase tracking-widest">
                 Success Strategy
              </div>
              <p className="text-[11px] text-navy/80 leading-relaxed font-medium italic border-l-2 border-gold pl-3">
                {data.recommendations}
              </p>
            </div>
            
            <div className="pt-4 border-t border-rule/50">
               <button 
                 onClick={() => runAnalysis()}
                 className="w-full py-2.5 rounded-xl border border-rule bg-white text-[9px] font-black uppercase tracking-widest text-silver hover:bg-smoke hover:text-navy transition-all"
               >
                 Re-Analyse
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
