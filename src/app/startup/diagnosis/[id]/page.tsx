// src/app/startup/diagnosis/[id]/page.tsx
'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useTeam } from '@/hooks/useTeams'
import { calculateOverallScore, classifyStage, scoreBg, scoreColor, scoreLabel, getMentorAssignment } from '@/utils/scores'
import { 
  CheckCircle2, Loader2, Target, ShieldCheck, Sparkles, 
  ArrowLeft, Clock, Lock, ArrowRight, Zap 
} from 'lucide-react'
import { cn } from '@/utils/cn'
import Link from 'next/link'

export default function DiagnosisDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: team, isLoading } = useTeam(params.id)
  
  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-silver animate-pulse">
      <div className="w-16 h-16 border-4 border-smoke border-t-navy rounded-full animate-spin" />
      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Decoding Strategic Patterns...</span>
    </div>
  )

  if (!team || team.deleted_at) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 bg-coral-lt text-coral rounded-3xl flex items-center justify-center mb-6 shadow-inner">
           <Lock size={32} />
        </div>
        <h2 className="text-2xl font-black text-navy mb-2">Access Restricted</h2>
        <p className="text-slate font-medium max-w-xs mx-auto mb-8">This diagnostic record is no longer available or was archived.</p>
        <Link href="/startup/submissions" className="text-navy font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
          <ArrowLeft size={14} /> Back to Submissions
        </Link>
      </div>
    )
  }

  // Restricted View Check (Blueprint v2.0 Error 20)
  if (!team.diagnosis_released) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-1000">
        <div className="w-24 h-24 bg-gold-lt text-gold rounded-[40px] flex items-center justify-center mb-10 shadow-lg shadow-gold/10 relative">
           <Clock size={40} strokeWidth={2.5} />
           <div className="absolute inset-0 rounded-[40px] border-2 border-gold border-t-transparent animate-spin-slow" />
        </div>
        <div className="space-y-4 max-w-md mx-auto">
          <h1 className="text-4xl font-black text-navy tracking-tight">Under Evaluation</h1>
          <p className="text-lg font-semibold text-slate leading-relaxed">
            Our programme team is currently reviewing Submission <span className="text-navy">#{team.submission_number}</span>. 
            You will receive full access to the diagnosis and roadmap once the evaluation is finalised.
          </p>
          <div className="pt-8">
            <Link 
              href="/startup/submissions" 
              className="px-10 py-5 bg-white border border-rule text-navy rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-smoke transition-all shadow-sm inline-flex items-center gap-3"
            >
              <ArrowLeft size={16} /> Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Full Diagnosis Logic
  const { overall, averages } = calculateOverallScore(team)
  const { stage, level } = classifyStage(team)
  const mentorType = getMentorAssignment(team)

  const scores = [
    { id: 'P1', val: averages.p1, title: 'Problem Clarity' },
    { id: 'P2', val: averages.p2, title: 'Discovery' },
    { id: 'P3', val: averages.p3, title: 'Product / TRL' },
    { id: 'P4', val: averages.p4, title: 'Differentiation' },
    { id: 'P5', val: averages.p5, title: 'Market Size' },
    { id: 'P6', val: averages.p6, title: 'Business Model' },
    { id: 'P7', val: averages.p7, title: 'Traction / CRL' },
    { id: 'P8', val: averages.p8, title: 'Team Readiness' },
    { id: 'P9', val: averages.p9, title: 'Advantage' },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-32 pt-8">
      {/* Breadcrumb */}
      <Link href="/startup/submissions" className="inline-flex items-center gap-2 text-[10px] font-black text-silver uppercase tracking-widest hover:text-navy transition-colors">
        <ArrowLeft size={12} /> Back to Submissions
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-silver">
             <ShieldCheck size={14} className="text-gold" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Evaluation Protocol v2.0</span>
          </div>
          <h1 className="text-4xl font-black text-navy tracking-tight leading-none">Diagnostic Analysis</h1>
          <p className="text-sm text-slate font-bold opacity-60">Result Output for {team.startupName || 'Your Venture'}</p>
        </div>
        <div className="flex flex-col md:items-end gap-3">
          <div className="px-5 py-2.5 bg-teal-lt text-teal text-[10px] font-black rounded-2xl border border-teal/10 flex items-center gap-2 shadow-sm">
            <CheckCircle2 size={14} /> RELEASED BY PROGRAMME TEAM
          </div>
          <span className="text-[9px] font-black text-silver uppercase tracking-widest">RECORD {team.id.slice(0, 8).toUpperCase()}</span>
        </div>
      </div>

      {/* Hero Stage Banner */}
      <div className="bg-navy rounded-[48px] p-10 md:p-16 relative overflow-hidden shadow-2xl shadow-navy/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 opacity-30 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 text-center md:text-left">
             <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-inner mb-2">
                <Target size={16} className="text-gold" /> Detected Venture Stage
             </div>
             <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">
                {stage}
             </h2>
             <div className="flex items-center justify-center md:justify-start gap-4">
               <span className="bg-gold text-navy text-[10px] font-black px-5 py-2.5 rounded-xl uppercase tracking-widest shadow-lg">Tier {level} BENCHMARK</span>
               <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
               <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">InUnity Strategic Registry</span>
             </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-12 rounded-[56px] flex flex-col items-center backdrop-blur-3xl min-w-[260px] shadow-2xl relative group hover:bg-white/10 transition-all duration-500">
            <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 relative z-10">Overall Core Score</span>
            <div className="flex items-baseline gap-1 relative z-10">
              <span className="text-8xl font-black text-white tabular-nums leading-none">
                {overall.toFixed(1)}
              </span>
              <span className="text-3xl font-black text-white/30">/ 5.0</span>
            </div>
            <div className={cn(
               "mt-8 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border relative z-10 shadow-xl",
               overall >= 4 ? "bg-teal text-white border-teal shadow-teal/20" : overall >= 3 ? "bg-gold text-navy border-gold shadow-gold/20" : "bg-coral text-white border-coral shadow-coral/20"
            )}>
              {scoreLabel(overall)}
            </div>
          </div>
        </div>
      </div>

      {/* Parameter Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scores.map((s, i) => (
          <div key={i} className="bg-white rounded-[32px] border border-rule p-10 shadow-sm hover:shadow-2xl hover:shadow-navy/5 transition-all duration-500 group">
             <div className="flex justify-between items-start mb-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-silver uppercase tracking-[0.2em] mb-2 group-hover:text-gold transition-colors">{s.id} Breakdown</span>
                  <h4 className="text-lg font-black text-navy tracking-tight leading-none">{s.title}</h4>
                </div>
                <div 
                  className="w-12 h-12 rounded-2xl items-center justify-center text-sm font-black tabular-nums border flex shadow-md transition-transform group-hover:scale-110"
                  style={{ backgroundColor: scoreBg(s.val), color: scoreColor(s.val), borderColor: 'transparent' }}
                >
                  {s.val > 0 ? s.val.toFixed(1) : '--'}
                </div>
             </div>
             
             <div className="h-3 w-full bg-smoke rounded-full overflow-hidden mb-6 p-0.5 shadow-inner">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                  style={{ width: `${(s.val / 5) * 100}%`, backgroundColor: scoreBg(s.val) }}
                />
             </div>
             
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-silver uppercase tracking-widest">READINESS</span>
                <span className="text-[10px] font-black text-navy uppercase tracking-widest opacity-80">{scoreLabel(s.val)}</span>
             </div>
          </div>
        ))}
      </div>

      {/* Mentor Support */}
      <div className="bg-gold-lt rounded-[48px] p-10 md:p-16 border border-gold/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 text-gold/20 rotate-12">
           <Zap size={120} strokeWidth={2} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
           <div className="w-24 h-24 rounded-[40px] bg-navy text-gold flex items-center justify-center shadow-2xl">
              <Zap size={48} fill="currentColor" />
           </div>
           <div className="space-y-4 text-center md:text-left">
              <h3 className="text-3xl font-black text-navy tracking-tight">Dedicated Mentor Focus</h3>
              <p className="text-lg font-semibold text-slate/70 max-w-xl">
                 Based on your current weakest parameters, we recommend prioritizing collaboration with a 
                 <span className="text-navy font-black mx-1.5 underline decoration-gold decoration-4 underline-offset-4">{mentorType}</span>
                 to accelerate your progress.
              </p>
           </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="py-20 border-t border-rule flex flex-col items-center">
         <p className="text-[10px] font-black text-silver uppercase tracking-[0.4em] mb-12">End of Diagnostic Dashboard</p>
         <div className="flex gap-6">
            <Link 
              href="/startup/submissions"
              className="px-10 py-5 border border-rule text-navy font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-smoke transition-all shadow-sm flex items-center gap-3"
            >
              <ArrowLeft size={16} /> Dashboard
            </Link>
            <Link 
              href="/startup/profiler"
              className="px-10 py-5 bg-navy text-white font-black text-[11px] uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-navy/20 flex items-center gap-3 active:scale-95 group"
            >
              Start New Profile <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-gold" />
            </Link>
         </div>
      </div>
    </div>
  )
}
