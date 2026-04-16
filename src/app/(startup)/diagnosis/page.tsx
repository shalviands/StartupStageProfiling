'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTeams } from '@/hooks/useTeams'
import { calculateOverallScore, classifyStage, scoreBg, scoreColor, scoreLabel, getRoadmap } from '@/utils/scores'
import { AlertCircle, CheckCircle2, FileText, Loader2, Zap, Target, ShieldCheck, TrendingUp, Sparkles, AlertTriangle } from 'lucide-react'
import { cn } from '@/utils/cn'
import Link from 'next/link'
import { PARAMETERS_CONFIG } from '@/config/parameters'

export default function DiagnosisResultsPage() {
  const router = useRouter()
  const { data: teams = [], isLoading } = useTeams()
  
  const team = teams[0]

  if (isLoading) return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <Loader2 className="animate-spin" size={32} />
      <span className="text-[10px] font-black uppercase tracking-widest leading-loose">Retrieving Your Diagnosis...</span>
    </div>
  )

  if (!team || team.submission_status !== 'finalised' || !team.diagnosis_visible) {
    router.push('/startup/submitted')
    return null
  }

  const { overall, p1, p2, p3, p4, p5, p6, p7, p8, p9 } = calculateOverallScore(team)
  const { stage, level } = classifyStage(team)
  const roadmap = getRoadmap(team)

  const scores = [
    { id: 'P1', val: p1, title: 'Problem Clarity' },
    { id: 'P2', val: p2, title: 'Discovery' },
    { id: 'P3', val: p3, title: 'Product / TRL' },
    { id: 'P4', val: p4, title: 'Differentiation' },
    { id: 'P5', val: p5, title: 'Market Size' },
    { id: 'P6', val: p6, title: 'Revenue Model' },
    { id: 'P7', val: p7, title: 'Traction / CRL' },
    { id: 'P8', val: p8, title: 'Team Readiness' },
    { id: 'P9', val: p9, title: 'Advantage' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Strategic Diagnosis</h1>
          <p className="text-slate-500 font-medium tracking-tight">Venture Readiness Report — {team.startupName || 'Your Startup'}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <CheckCircle2 size={10} /> Finalised Diagnosis
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{new Date().toLocaleDateString('en-GB')}</span>
        </div>
      </div>

      {/* Stage Banner */}
      <div className="bg-slate-900 rounded-[32px] p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-slate-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:row items-center justify-between gap-12">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-[11px] font-black uppercase tracking-widest">
                <Target size={14} className="text-amber-500" /> Detected Venture Stage
             </div>
             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
                {stage}
             </h2>
             <div className="flex items-center gap-3">
               <span className="bg-amber-500 text-slate-900 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">Tier {level}</span>
               <span className="text-slate-400 text-xs font-bold uppercase tracking-widest border-l border-white/10 pl-3">Diagnostic Benchmark 2024</span>
             </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] flex flex-col items-center backdrop-blur-md min-w-[200px]">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Overall Score</span>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-black text-white tabular-nums drop-shadow-2xl">
                {overall.toFixed(1)}
              </span>
              <span className="text-xl font-bold text-slate-500">/ 5.0</span>
            </div>
            <div className={cn(
               "mt-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
               overall >= 4 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"
            )}>
              {scoreLabel(overall)}
            </div>
          </div>
        </div>
      </div>

      {/* Score Grid — Similar to PDF page 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scores.map((s, i) => (
          <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:translate-y-[-4px] transition-all duration-300">
             <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{s.id}</span>
                  <h4 className="text-sm font-black text-slate-900 tracking-tight leading-tight">{s.title}</h4>
                </div>
                <div 
                  className="px-2.5 py-1 rounded-xl text-xs font-black tabular-nums border"
                  style={{ backgroundColor: scoreBg(s.val), color: scoreColor(s.val), borderColor: scoreColor(s.val) + '20' }}
                >
                  {s.val.toFixed(1)}
                </div>
             </div>
             
             <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full transition-all duration-1000"
                  style={{ width: `${(s.val / 5) * 100}%`, backgroundColor: scoreColor(s.val) }}
                />
             </div>
             
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               {scoreLabel(s.val)}
             </p>
          </div>
        ))}
      </div>

      {/* Strategic Roadmap */}
      <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 md:p-12 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <div>
             <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2 block flex items-center gap-2">
                <Sparkles size={14} /> Recommended Strategic Path
             </span>
             <h3 className="text-2xl font-black text-slate-900 tracking-tight">4-Week Venture Sprint</h3>
           </div>
           <div className="hidden md:flex flex-col items-end">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Mentor</span>
             <div className="flex items-center gap-2 text-slate-700 font-bold text-xs bg-white px-4 py-2 rounded-2xl border border-slate-200">
               <Zap size={14} className="text-amber-500" /> {team.assigned_mentor_type || 'Discovery Lead'}
             </div>
           </div>
        </div>
        
        <div className="p-8 md:p-12">
          <table className="w-full border-separate border-spacing-y-4">
             <thead>
               <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                 <th className="pb-2 px-4">Priority</th>
                 <th className="pb-2 px-4">Action Item</th>
                 <th className="pb-2 px-4">Support From</th>
                 <th className="pb-2 px-4">Timeline</th>
               </tr>
             </thead>
             <tbody>
               {roadmap.map((item: any, i: number) => (
                 <tr key={i} className="group">
                   <td className="px-4">
                     <span className={cn(
                       "inline-flex w-8 h-8 rounded-xl items-center justify-center text-[11px] font-black border",
                       item.priority === 'P0' ? "bg-rose-50 text-rose-600 border-rose-100" : item.priority === 'P1' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                     )}>
                       {item.priority}
                     </span>
                   </td>
                   <td className="px-4 py-4 bg-slate-50 border-y border-l border-slate-100 rounded-l-2xl">
                     <p className="text-sm font-bold text-slate-700">{item.action}</p>
                   </td>
                   <td className="px-4 py-4 bg-slate-50 border-y border-slate-100">
                     <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                        <UserIcon className="w-3 h-3" /> {item.supportFrom}
                     </span>
                   </td>
                   <td className="px-4 py-4 bg-slate-50 border-y border-r border-slate-100 rounded-r-2xl">
                     <span className="text-[10px] font-black text-slate-400 uppercase">{item.byWhen}</span>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-12 flex flex-col items-center justify-center border-t border-slate-200">
         <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Want more detailed insights?</p>
         <div className="flex items-center gap-4">
            <Link 
              href="/startup/profile"
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-3"
            >
               <FileText size={16} /> View Submission Detail
            </Link>
         </div>
      </div>
    </div>
  )
}

function UserIcon(props: any) {
  return (
    <svg 
      {...props}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
