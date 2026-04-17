'use client'

import React from 'react'
import { 
  X, 
  Sparkles, 
  Target, 
  Zap, 
  TrendingUp, 
  AlertCircle, 
  Calendar,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Package,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useStageExplanation } from '@/hooks/useStageExplanation'
import { useAIRoadmap } from '@/hooks/useAIRoadmap'
import { TeamProfile } from '@/types/team.types'

interface Props {
  isOpen: boolean
  onClose: () => void
  team: TeamProfile
  mode: 'explanation' | 'roadmap'
}

export default function AIAssistantDrawer({ isOpen, onClose, team, mode }: Props) {
  const { 
    mutate: explainStage, 
    data: explanation, 
    isPending: isExplaining, 
    error: explainError 
  } = useStageExplanation(team.id)

  const { 
    mutate: generateRoadmap, 
    data: roadmap, 
    isPending: isGeneratingRoadmap, 
    error: roadmapError 
  } = useAIRoadmap(team.id)

  React.useEffect(() => {
    if (isOpen) {
      if (mode === 'explanation' && !explanation) explainStage()
      if (mode === 'roadmap' && !roadmap) generateRoadmap()
    }
  }, [isOpen, mode])

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-[500px] bg-white shadow-2xl z-[101] transition-transform duration-700 ease-out flex flex-col overflow-hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-200">
              {mode === 'explanation' ? <Target size={20} /> : <Calendar size={20} />}
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">
                {mode === 'explanation' ? 'Stage Intelligence' : 'AI Strategic Roadmap'}
              </h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                Neural Analysis • InUnity Master Profile
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
          
          {/* STAGE EXPLANATION MODE */}
          {mode === 'explanation' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
               {isExplaining ? (
                 <LoadingState label="Decoding Stage Logic..." />
               ) : explainError ? (
                 <ErrorState label="Link sync failed" />
               ) : (
                 <>
                   {/* Verdict Card */}
                   <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                           <ShieldCheck size={16} className="text-violet-400" />
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Neural Verdict</span>
                        </div>
                        <p className="text-lg font-black leading-tight mb-4">{explanation?.why_this_stage}</p>
                        <div className="h-px w-full bg-white/10 mb-4" />
                        <div className="flex items-center gap-3 text-white/60">
                           <Zap size={14} className="text-yellow-400" />
                           <p className="text-[10px] font-bold uppercase tracking-widest">Calculated with 9 parameters</p>
                        </div>
                      </div>
                   </div>

                   {/* Next Level Requirements */}
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">
                         <TrendingUp size={14} className="text-emerald-500" />
                         Next Stage Evolution
                      </div>
                      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[28px] text-[13px] font-bold text-emerald-900 leading-relaxed shadow-sm">
                         {explanation?.what_would_move_them_up}
                      </div>
                   </div>

                   {/* Honest Assessment */}
                   <div className="p-6 bg-slate-50 border border-slate-200 border-dashed rounded-[28px] relative group">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Honest Diagnosis</div>
                      <p className="text-[12px] font-black text-slate-600 leading-relaxed italic pr-4">
                        "{explanation?.honest_assessment}"
                      </p>
                   </div>
                 </>
               )}
            </div>
          )}

          {/* ROADMAP MODE */}
          {mode === 'roadmap' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
               {isGeneratingRoadmap ? (
                 <LoadingState label="Mapping Strategic Sprints..." />
               ) : roadmapError ? (
                 <ErrorState label="Navigation link lost" />
               ) : (
                 <>
                   {/* Sprint Overview */}
                   <div className="grid grid-cols-1 gap-4">
                      {[1, 2, 3, 4].map((num) => {
                        const week = (roadmap as any)[`week${num}`]
                        if (!week) return null
                        return (
                          <div key={num} className="group flex bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:border-violet-100 transition-all duration-500">
                             <div className="flex flex-col items-center gap-2 pr-6 border-r border-slate-50">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Week</span>
                                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-lg">
                                   {num}
                                </div>
                             </div>
                             <div className="pl-6 space-y-4 flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-violet-100">
                                     {week.focus}
                                  </div>
                                </div>
                                <h4 className="text-base font-black text-slate-900 tracking-tight group-hover:text-violet-600 transition-colors">
                                   {week.title}
                                </h4>
                                <div className="space-y-2">
                                   {week.actions.map((action: string, i: number) => (
                                      <div key={i} className="flex gap-3 text-[11px] font-bold text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                                         <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-1.5 flex-shrink-0" />
                                         {action}
                                      </div>
                                   ))}
                                </div>
                                <div className="pt-2 flex items-center gap-2 text-[9px] font-black uppercase text-emerald-600 tracking-widest">
                                   <CheckCircle2 size={12} />
                                   Metric: {week.success_metric}
                                </div>
                             </div>
                          </div>
                        )
                      })}
                   </div>

                   {/* Priority Needs */}
                   <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-6">
                      <div className="flex justify-between items-center">
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Critical Priorities</div>
                        <Sparkles size={14} className="text-violet-400" />
                      </div>
                      
                      <div className="space-y-4">
                        <PriorityItem label="P0: Pre-Event Focus" content={roadmap?.p0_need} theme="coral" />
                        <PriorityItem label="P1: Programme Goal" content={roadmap?.p1_need} theme="amber" />
                        <PriorityItem label="P2: Long-term Moat" content={roadmap?.p2_need} theme="teal" />
                      </div>
                   </div>

                   {/* Tool Stack */}
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">
                         <Package size={14} />
                         Recommended AI Stack
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                         {roadmap?.recommended_tools.map((tool: string, i: number) => (
                           <div key={i} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-4 group hover:bg-slate-50 transition-colors">
                              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors">
                                 <ChevronRight size={14} />
                              </div>
                              <span className="text-[11px] font-bold text-slate-700">{tool}</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Regenerate Button */}
                   <button 
                     onClick={() => generateRoadmap()}
                     className="w-full py-5 rounded-[28px] border-2 border-slate-100 bg-white text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
                   >
                     <Zap size={14} className="group-hover:text-yellow-400 transition-colors" />
                     Recalibrate 4-Week Strategy
                     <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                 </>
               )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 border-t border-slate-100">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                 <ShieldCheck size={14} className="text-slate-400" />
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                InUnity Master Intelligence • Compliance Verified
              </p>
           </div>
        </div>
      </div>
    </>
  )
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-50 border-t-slate-900 rounded-full animate-spin" />
        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-900 animate-pulse" size={20} />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] inline-flex">
          {label}
        </span>
        <span className="text-[9px] font-bold text-slate-400 uppercase">Analysing node parameters...</span>
      </div>
    </div>
  )
}

function ErrorState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
      <div className="w-16 h-16 rounded-[24px] bg-rose-50 text-rose-500 flex items-center justify-center">
        <AlertCircle size={32} />
      </div>
      <div className="space-y-1">
        <div className="text-xs font-black text-rose-900 uppercase tracking-widest">{label}</div>
        <div className="text-[10px] font-bold text-rose-400 uppercase">Check API engine status</div>
      </div>
    </div>
  )
}

function PriorityItem({ label, content, theme }: { label: string, content?: string, theme: 'coral' | 'amber' | 'teal' }) {
  const colors = {
    coral: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    teal: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  }
  return (
    <div className={cn("p-5 rounded-3xl border", colors[theme])}>
      <div className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-70">{label}</div>
      <p className="text-[11px] font-black leading-relaxed">{content}</p>
    </div>
  )
}
