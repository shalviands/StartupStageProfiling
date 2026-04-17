'use client'

import React, { useState } from 'react'
import { 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  Target, 
  TrendingUp, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  LayoutGrid,
  Lightbulb
} from 'lucide-react'
import { useDashboardInsights } from '@/hooks/useDashboardInsights'
import { cn } from '@/utils/cn'

export default function CohortInsights() {
  const { mutate: runDiscovery, data, isPending, error } = useDashboardInsights()
  const [showFull, setShowFull] = useState(false)

  return (
    <div className="bg-white rounded-[40px] border border-rule overflow-hidden shadow-sm transition-all duration-700 hover:shadow-xl hover:shadow-navy/5">
      {/* Header */}
      <div className="p-8 border-b border-rule bg-smoke/30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-navy text-white flex items-center justify-center shadow-lg shadow-navy/20">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-navy tracking-tight leading-none mb-1">Strategic Cohort Intelligence</h3>
            <p className="text-[10px] text-silver font-black uppercase tracking-widest">Neural Programme Diagnosis</p>
          </div>
        </div>
        {!data && !isPending && (
          <button 
            onClick={() => runDiscovery()}
            className="flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-navy/90 transition-all shadow-xl shadow-navy/20 active:scale-95 group"
          >
            Generate AI Insights
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      <div className="p-8">
        {!data && !isPending && !error && (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-6 max-w-sm mx-auto">
             <div className="w-20 h-20 rounded-[32px] bg-smoke flex items-center justify-center text-silver/40">
                <Target size={40} />
             </div>
             <p className="text-sm font-bold text-slate leading-relaxed">
               Analyse collective cohort data to identify global gaps, programme design priorities, and at-risk venture profiles.
             </p>
          </div>
        )}

        {isPending && (
          <div className="py-24 flex flex-col items-center justify-center gap-6">
             <div className="relative">
                <div className="w-16 h-16 border-4 border-smoke border-t-navy rounded-full animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-navy animate-pulse" size={24} />
             </div>
             <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black text-navy uppercase tracking-[0.3em]">Synapsing Cohort Nodes</span>
                <span className="text-[9px] font-black text-silver uppercase">Aggregating 9-parameter metrics...</span>
             </div>
          </div>
        )}

        {error && (
          <div className="p-8 border-2 border-coral/10 bg-coral-lt rounded-[32px] flex items-center gap-6 max-w-xl mx-auto">
             <div className="w-16 h-16 rounded-2xl bg-white text-coral flex items-center justify-center shadow-md">
                <AlertCircle size={32} />
             </div>
             <div className="space-y-1">
                <h4 className="text-sm font-black text-coral-dk uppercase tracking-[0.2em]">Logic Calibration Error</h4>
                <p className="text-xs font-bold text-coral opacity-80 uppercase tracking-widest leading-loose">Check node infrastructure and retry.</p>
             </div>
          </div>
        )}

        {data && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-8">
            {/* Top Level Verdict */}
            <div className="bg-navy rounded-[36px] p-10 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="px-4 py-2 bg-white/10 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-gold shadow-inner">
                        Executive Overview
                     </div>
                  </div>
                  <p className="text-2xl font-black tracking-tight leading-tight">
                    {data.cohort_summary}
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Strengths \u0026 Gaps */}
               <div className="space-y-4">
                  <div className="p-8 bg-smoke/50 border border-rule rounded-[32px] space-y-4 hover:border-teal/30 transition-all group">
                     <div className="flex items-center gap-3 text-teal">
                        <TrendingUp size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Global Stronghold</span>
                     </div>
                     <p className="text-[13px] font-bold text-navy leading-relaxed">{data.strongest_cohort_area}</p>
                  </div>
                  <div className="p-8 bg-smoke/50 border border-rule rounded-[32px] space-y-4 hover:border-coral/30 transition-all">
                     <div className="flex items-center gap-3 text-coral">
                        <AlertCircle size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Critical Cohort Gap</span>
                     </div>
                     <p className="text-[13px] font-bold text-navy leading-relaxed">{data.biggest_cohort_gap}</p>
                  </div>
               </div>

               {/* Programme Design */}
               <div className="bg-white border-2 border-navy/5 rounded-[32px] p-8 space-y-6 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 px-2">
                     <div className="w-10 h-10 bg-smoke text-navy rounded-2xl flex items-center justify-center">
                        <LayoutGrid size={20} />
                     </div>
                     <div>
                        <h4 className="text-base font-black text-navy tracking-tight leading-none mb-1">Programme Evolution</h4>
                        <p className="text-[9px] font-black text-silver uppercase tracking-widest">AI Design Recommendation</p>
                     </div>
                  </div>
                  <p className="text-[13px] font-bold text-slate leading-relaxed flex-1">
                    {data.programme_recommendation}
                  </p>
                  <div className="p-5 bg-smoke rounded-2xl border border-rule flex items-center justify-between">
                     <span className="text-[10px] font-black text-navy uppercase tracking-widest">Design Confidence</span>
                     <span className="text-sm font-black text-teal tracking-tighter">98% Match</span>
                  </div>
               </div>
            </div>

            {/* Bottom Section: Specific Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InsightCard 
                  icon={ShieldCheck} 
                  label="Risk Notification" 
                  content={data.teams_needing_attention} 
                  color="text-coral"
                />
                <InsightCard 
                  icon={Zap} 
                  label="Positive Signal" 
                  content={data.positive_signal} 
                  color="text-gold"
                />
                <InsightCard 
                  icon={Lightbulb} 
                  label="Instructional Tip" 
                  content={data.programme_design_tip} 
                  color="text-teal"
                />
            </div>

            {/* Refresh */}
            <div className="pt-6 flex justify-center">
               <button 
                 onClick={() => runDiscovery()}
                 disabled={isPending}
                 className="flex items-center gap-3 text-silver hover:text-navy text-[10px] font-black uppercase tracking-widest transition-all"
               >
                 🔄 Recalibrate Strategic Insights
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function InsightCard({ icon: Icon, label, content, color }: any) {
  return (
    <div className="p-6 bg-white border border-rule rounded-[28px] space-y-3 hover:shadow-lg transition-all border-b-2 border-b-smoke group overflow-hidden">
       <div className={cn("flex items-center gap-3", color)}>
          <Icon size={16} className="group-hover:scale-125 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
       </div>
       <p className="text-[11px] font-bold text-slate leading-relaxed">{content}</p>
    </div>
  )
}
