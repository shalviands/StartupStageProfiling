'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTeams } from '@/hooks/useTeams'
import { calculateOverallScore, classifyStage, scoreBg, scoreColor, scoreLabel, getRoadmap } from '@/utils/scores'
import { AlertCircle, CheckCircle2, FileText, Loader2, Zap, Target, ShieldCheck, TrendingUp, Sparkles, AlertTriangle, ArrowRight, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'
import Link from 'next/link'
import { PARAMETERS_CONFIG } from '@/config/parameters'

export default function DiagnosisResultsPage() {
  const router = useRouter()
  const { data: teams = [], isLoading } = useTeams()
  
  const team = teams[0]

  if (isLoading) return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-silver">
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
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3 text-silver">
             <ShieldCheck size={14} className="text-gold" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Official Diagnostic Record</span>
          </div>
          <h1 className="text-3xl font-black text-navy tracking-tight leading-none">Strategic Diagnosis</h1>
          <p className="text-sm text-slate font-semibold uppercase tracking-widest text-[10px] opacity-60">Result Output for {team.startupName || 'Your Venture'}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-teal uppercase tracking-widest mb-1 shadow-sm flex items-center gap-1.5 bg-teal-lt px-4 py-2 rounded-full border border-teal/10">
            <CheckCircle2 size={12} fill="currentColor" className="text-white" /> Finalised Baseline
          </span>
          <span className="text-[9px] font-black text-silver uppercase tracking-widest mt-2">{new Date().toLocaleDateString('en-GB')} • NODE {team.id.slice(0, 4)}</span>
        </div>
      </div>

      {/* Stage Banner */}
      <div className="bg-navy rounded-[40px] p-10 md:p-14 relative overflow-hidden shadow-2xl shadow-navy/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 text-center md:text-left">
             <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-inner">
                <Target size={16} className="text-gold" /> Detected Venture Stage
             </div>
             <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-2">
                {stage}
             </h2>
             <div className="flex items-center justify-center md:justify-start gap-4">
               <span className="bg-gold text-navy text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg">Tier {level} BENCHMARK</span>
               <div className="w-1 h-1 bg-white/20 rounded-full" />
               <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">InUnity Registry 2024</span>
             </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-10 rounded-[48px] flex flex-col items-center backdrop-blur-xl min-w-[240px] shadow-2xl relative group">
            <div className="absolute inset-0 bg-gold/5 rounded-[48px] opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] mb-3 relative z-10">Overall Core Score</span>
            <div className="flex items-baseline gap-1 relative z-10">
              <span className="text-7xl font-black text-white tabular-nums leading-none">
                {overall.toFixed(1)}
              </span>
              <span className="text-2xl font-black text-white/30">/ 5.0</span>
            </div>
            <div className={cn(
               "mt-6 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border relative z-10 shadow-sm",
               overall >= 4 ? "bg-teal text-white border-teal shadow-teal/20" : "bg-gold text-navy border-gold shadow-gold/20"
            )}>
              {scoreLabel(overall)}
            </div>
          </div>
        </div>
      </div>

      {/* Score Grid — Similar to PDF page 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scores.map((s, i) => (
          <div key={i} className="bg-white rounded-[32px] border border-rule p-8 shadow-sm hover:shadow-xl hover:shadow-navy/5 transition-all duration-300 group">
             <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-silver uppercase tracking-[0.2em] mb-1.5 group-hover:text-gold transition-colors">{s.id}</span>
                  <h4 className="text-base font-black text-navy tracking-tight leading-loose">{s.title}</h4>
                </div>
                <div 
                  className="w-10 h-10 rounded-2xl items-center justify-center text-xs font-black tabular-nums border flex shadow-sm"
                  style={{ backgroundColor: scoreBg(s.val), color: scoreColor(s.val), borderColor: scoreColor(s.val) + '20' }}
                >
                  {s.val.toFixed(1)}
                </div>
             </div>
             
             <div className="h-2 w-full bg-smoke rounded-full overflow-hidden mb-4 p-0.5">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out shadow-inner"
                  style={{ width: `${(s.val / 5) * 100}%`, backgroundColor: scoreColor(s.val) }}
                />
             </div>
             
             <p className="text-[10px] font-black text-silver uppercase tracking-widest opacity-60">
               {scoreLabel(s.val)} Readiness
             </p>
          </div>
        ))}
      </div>

      {/* Strategic Roadmap */}
      <div className="bg-white rounded-[48px] border border-rule overflow-hidden shadow-sm">
        <div className="p-10 md:p-14 border-b border-rule flex flex-col md:flex-row md:items-center justify-between bg-smoke/30 gap-6">
           <div>
             <span className="text-[11px] font-black text-navy uppercase tracking-[0.3em] mb-3 block flex items-center gap-2">
                <Sparkles size={16} className="text-gold" /> Strategic Value Roadmap
             </span>
             <h3 className="text-3xl font-black text-navy tracking-tight leading-none">Accelerated Venture Sprint</h3>
           </div>
           <div className="flex flex-col items-start md:items-end">
             <span className="text-[10px] font-black text-silver uppercase tracking-widest mb-2">Assigned Oversight</span>
             <div className="flex items-center gap-3 text-navy font-black text-[11px] bg-white px-5 py-2.5 rounded-2xl border border-rule shadow-sm uppercase tracking-widest">
               <Zap size={14} className="text-gold" fill="currentColor" /> {team.assigned_mentor_type || 'Discovery Lead'}
             </div>
           </div>
        </div>
        
        <div className="p-8 md:p-14 overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-4 min-w-[600px]">
             <thead>
               <tr className="text-[10px] font-black text-silver uppercase tracking-[0.2em] text-left">
                 <th className="pb-2 px-6">Priority</th>
                 <th className="pb-2 px-6">Strategic Action Item</th>
                 <th className="pb-2 px-6">Support Layer</th>
                 <th className="pb-2 px-6">Timeline</th>
               </tr>
             </thead>
             <tbody>
               {roadmap.map((item: any, i: number) => (
                 <tr key={i} className="group cursor-default">
                   <td className="px-6">
                     <span className={cn(
                       "inline-flex w-10 h-10 rounded-2xl items-center justify-center text-[11px] font-black border shadow-sm transition-transform group-hover:scale-110",
                       item.priority === 'P0' ? "bg-coral-lt text-coral border-coral/10" : item.priority === 'P1' ? "bg-gold-lt text-gold border-gold/10" : "bg-purple-lt text-purple border-purple/10"
                     )}>
                       {item.priority}
                     </span>
                   </td>
                   <td className="px-8 py-6 bg-smoke border-y border-l border-rule/50 rounded-l-3xl group-hover:bg-white group-hover:border-navy/20 transition-all">
                     <p className="text-sm font-black text-navy tracking-tight leading-relaxed">{item.action}</p>
                   </td>
                   <td className="px-8 py-6 bg-smoke border-y border-rule/50 group-hover:bg-white group-hover:border-navy/20 transition-all">
                     <span className="text-[10px] font-black text-silver uppercase tracking-widest flex items-center gap-2">
                        <UserIcon className="w-3.5 h-3.5" /> {item.supportFrom}
                     </span>
                   </td>
                   <td className="px-8 py-6 bg-smoke border-y border-r border-rule/50 rounded-r-3xl group-hover:bg-white group-hover:border-navy/20 transition-all">
                     <span className="text-[10px] font-black text-navy uppercase tracking-widest opacity-40">{item.byWhen}</span>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 flex flex-col items-center justify-center border-t border-rule mt-10">
         <p className="text-[11px] font-black text-silver uppercase tracking-[0.3em] mb-10">Advanced venture intelligence is active</p>
         <div className="flex items-center gap-6">
            <Link 
              href="/startup/profile"
              className="px-12 py-5 bg-navy text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-2xl shadow-navy/20 flex items-center gap-3 active:scale-95 group"
            >
               <FileText size={16} className="text-gold" /> 
               <span>View Integrated Profile</span>
               <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
