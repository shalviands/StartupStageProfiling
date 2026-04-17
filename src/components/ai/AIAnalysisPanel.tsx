'use client'

import React from 'react'
import { Sparkles, Loader2, AlertCircle, CheckCircle2, Zap, Target, Quote, TrendingUp, Calendar, ArrowRight } from 'lucide-react'
import { useAIAnalysis } from '@/hooks/useAIAnalysis'
import { useAIRoadmap } from '@/hooks/useAIRoadmap'
import { cn } from '@/utils/cn'

interface Props {
  teamId: string
}

export default function AIAnalysisPanel({ teamId }: Props) {
  const { mutate: runAnalysis, data, isPending, error } = useAIAnalysis(teamId)
  const { mutate: generateRoadmap, isPending: isGeneratingRoadmap } = useAIRoadmap(teamId)

  return (
    <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-6 min-h-[400px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-200">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">InUnity Strategic AI</h3>
            <p className="text-[9px] font-bold text-slate-600 mt-1 uppercase tracking-tighter">Powered by Llama 3.1 Neural Engine</p>
          </div>
        </div>
        {data?.model_used && (
          <span className="text-[8px] font-black text-slate-600 uppercase bg-white border border-slate-300 px-3 py-1.5 rounded-full shadow-sm">
            {data.model_used.split('/')[1]?.split(':')[0] || 'Neural Core'}
          </span>
        )}
      </div>

      {!data && !isPending && !error && (
        <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
          <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center shadow-xl shadow-slate-200 border border-slate-100">
            <Sparkles size={28} className="text-slate-200" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Diagnostic Intelligence</p>
            <p className="text-[10px] font-bold text-slate-500 max-w-[200px] leading-relaxed">
              Run neural analysis to identify growth moats and weakest-link bottlenecks based on YC, Lean Startup, and TRL frameworks.
            </p>
          </div>
          <button 
            onClick={() => runAnalysis()}
            className="group bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-300 flex items-center gap-3"
          >
            Run AI Diagnosis
            <Zap size={14} className="group-hover:text-yellow-400 transition-colors" />
          </button>
        </div>
      )}

      {isPending && (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-900 animate-pulse" size={16} />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] inline-flex">
              Processing Engine
            </span>
            <span className="text-[9px] font-bold text-slate-600 uppercase">Analysing 9 parameters...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-5 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
            <AlertCircle size={20} />
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] font-black text-rose-900 uppercase tracking-widest">Neural Link Failure</p>
            <p className="text-[10px] font-bold text-rose-500 mt-0.5">Check API configuration and retry.</p>
          </div>
        </div>
      )}

      {data && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-6">
          {/* Readiness Summary */}
          <div className="bg-slate-900 rounded-[32px] p-6 text-white shadow-2xl shadow-slate-200">
             <div className="flex items-center gap-2 mb-4">
                <Target size={14} className="text-violet-400" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70">Readiness Summary</span>
             </div>
             <p className="text-[13px] font-black leading-relaxed italic">"{data.readiness_summary}"</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Strengths */}
            <div className="bg-white border border-slate-100 p-5 rounded-[28px] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                <CheckCircle2 size={14} />
                Venture Strengths
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed font-bold pl-1">
                {data.strengths}
              </p>
            </div>

            {/* Stage Insight */}
            <div className="bg-white border border-slate-100 p-5 rounded-[28px] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[9px] font-black text-amber-600 uppercase tracking-widest">
                <TrendingUp size={14} />
                Stage Intelligence
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed font-bold pl-1">
                {data.stage_insight}
              </p>
            </div>

            {/* Gaps */}
            <div className="bg-white border border-slate-100 p-5 rounded-[28px] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[9px] font-black text-rose-500 uppercase tracking-widest">
                 <AlertCircle size={14} />
                 Growth Inhibitors
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed font-bold pl-1">
                {data.gaps}
              </p>
            </div>

            {/* Recommendations */}
            <div className="bg-violet-50 border border-violet-100 p-5 rounded-[28px] space-y-3">
              <div className="flex items-center gap-2 text-[9px] font-black text-violet-700 uppercase tracking-widest">
                 <Zap size={14} />
                 Recommended Next Steps
              </div>
              <p className="text-[11px] text-slate-800 leading-relaxed font-black pl-1">
                {data.recommendations}
              </p>
            </div>

            {/* Founder Note */}
            <div className="bg-slate-50 border border-slate-200 border-dashed p-6 rounded-[28px] relative">
               <Quote className="absolute top-4 right-6 text-slate-200" size={32} />
               <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  A Note to the Founder
               </div>
               <p className="text-[11px] text-slate-600 leading-relaxed font-semibold pr-8 italic">
                 {data.founder_note}
               </p>
            </div>
            
            <div className="pt-4 px-2">
               <button 
                 onClick={() => runAnalysis()}
                 className="w-full py-4 rounded-2xl border border-slate-200 bg-white text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
               >
                 🔄 Recalibrate Tactical Insights
               </button>
            </div>

            <div className="pt-2 px-2">
               <button 
                 onClick={() => generateRoadmap()}
                 disabled={isGeneratingRoadmap}
                 className="w-full py-5 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 disabled:opacity-50 group"
               >
                 {isGeneratingRoadmap ? (
                   <Loader2 size={16} className="animate-spin" />
                 ) : (
                   <>
                     <Calendar size={16} />
                     Generate AI Roadmap
                     <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                   </>
                 )}
               </button>
               <p className="text-[8px] font-bold text-slate-400 text-center mt-3 uppercase tracking-widest">
                 Saves 4-week sprint directly to profile
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
