'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PARAMETERS_CONFIG } from '@/config/parameters'
import { calculateOverallScore, classifyStage, scoreBg, scoreColor } from '@/utils/scores'
import SectionTabs from '@/components/form/SectionTabs'
import Section1BasicInfo from '@/components/form/Section1BasicInfo'
import ParameterSection from '@/components/form/ParameterSection'
import { TeamProfile } from '@/types/team.types'
import { cn } from '@/utils/cn'
import { 
  ShieldCheck, 
  ChevronLeft, 
  Save, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Lock, 
  Unlock,
  Sparkles,
  AlertTriangle,
  Loader2,
  FileText,
  Download
} from 'lucide-react'
import { useTeam, useUpdateTeam } from '@/hooks/useTeams'
import dynamic from 'next/dynamic'
import PDFDownloadButton from '@/components/pdf/PDFDownloadButton'

export default function AdminStartupDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  // Use the single team hook to directly fetch instead of waiting for list
  const { data: activeTeam, isLoading } = useTeam(id as string)
  const updateTeam = useUpdateTeam()

  const [activeSection, setActiveSection] = useState(0)
  const [localTeam, setLocalTeam] = useState<TeamProfile | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Only update localTeam if it was null OR if the ID of the startup changed
    // This prevents background refetches from snapping-back user typing
    if (activeTeam && (!localTeam || localTeam.id !== id)) {
      setLocalTeam(activeTeam)
    }
  }, [activeTeam, id, localTeam?.id])

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function scheduleUpdate(field: string, value: any) {
    if (!localTeam) return
    
    const nextTeam = { ...localTeam, [field]: value }
    const { stage } = classifyStage(nextTeam)
    const { overall, isBonusActive } = calculateOverallScore(nextTeam)

    const updated = { 
      ...nextTeam, 
      detected_stage: stage,
      overall_weighted_score: overall,
      p9_bonus_active: isBonusActive,
    }
    
    setLocalTeam(updated)
    
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaving(true)
      try {
        await updateTeam.mutateAsync({ 
          id: localTeam.id, 
          updates: { 
            [field]: value,
            detected_stage: stage,
            overall_weighted_score: overall
          } 
        })
      } catch (err) {
        console.error('[AdminDetail] AutoSave failed:', err)
      } finally {
        setSaving(false)
      }
    }, 600)
  }

  // Visibility toggle removed as per schema restructuring (dropped from DB)

  async function toggleRelease() {
    if (!localTeam) return
    const nextState = !localTeam.diagnosis_released
    try {
      setSaving(true)
      const res = await fetch('/api/programme/release-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: localTeam.id, release: nextState })
      })
      
      if (!res.ok) throw new Error('Failed to update release state')
      
      setLocalTeam({ 
        ...localTeam, 
        diagnosis_released: nextState
      })
    } catch (err) {
      console.error('[AdminDetail] Release toggle failed:', err)
      alert('Failed to update release state. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <Loader2 className="animate-spin" size={32} />
      <span className="text-[10px] font-black uppercase tracking-widest">Initialising Profiler...</span>
    </div>
  )
  
  if (!localTeam) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <AlertTriangle size={32} className="text-rose-400" />
      <span className="text-[10px] font-black uppercase tracking-widest">Startup Not Found or Access Denied</span>
      <button onClick={() => router.push('/admin/startups')} className="mt-4 border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">
        Back to Portfolio
      </button>
    </div>
  )

  const isReleased = localTeam.diagnosis_released

  return (
    <div className="flex flex-col h-full bg-[#F4F6F9]">
      {/* Admin Top Bar Overlay */}
      <div className="bg-white border-b border-slate-200 px-10 py-4 flex items-center justify-between sticky top-0 z-[60] shadow-sm backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.push('/admin/startups')}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center group-hover:bg-slate-50">
              <ChevronLeft size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest pt-0.5">Back to Portfolio</span>
          </button>
          
          <div className="h-6 w-px bg-slate-200" />
          
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-navy tracking-tight leading-none">{localTeam.startupName || 'Profiling Session'}</h1>
            <div className="flex items-center gap-2 mt-1.5">
               <span className="text-[9px] font-black text-silver uppercase tracking-[0.2em]">{localTeam.id.slice(0, 8)}</span>
               <div className={cn(
                 "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                 isReleased ? "bg-teal-lt text-teal border border-teal/10" : "bg-gold-lt text-gold border border-gold/10"
               )}>
                 {isReleased ? 'DIAGNOSIS RELEASED' : 'UNDER EVALUATION'}
               </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {saving && (
             <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 animate-pulse">
                <Loader2 size={12} className="animate-spin" /> Auto-Syncing...
             </div>
           )}

           <div className="flex items-center gap-2 p-1.5 bg-smoke rounded-2xl border border-rule">
              <button 
                onClick={toggleRelease}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm",
                  isReleased 
                    ? "bg-teal text-white" 
                    : "bg-gold text-navy"
                )}
              >
                {isReleased ? <CheckCircle2 size={14} /> : <Sparkles size={14} />}
                {isReleased ? 'Diagnosis Released' : 'Release Diagnosis'}
              </button>
           </div>

           <div className="h-4 w-px bg-slate-200" />
           
           <PDFDownloadButton team={localTeam} />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Form Area */}
        <div className="flex-1 overflow-y-auto px-10 py-12 custom-scrollbar">
           <div className="max-w-4xl mx-auto space-y-12">
             <div className="flex items-center justify-between bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />
               <div className="relative z-10 flex items-center gap-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Overall Weighted Score</span>
                    <div className="flex items-baseline gap-1">
                       <span className={cn(
                         "text-5xl font-black tabular-nums tracking-tighter",
                         (localTeam.overall_weighted_score ?? 0) >= 4 ? "text-emerald-600" : (localTeam.overall_weighted_score ?? 0) >= 3 ? "text-amber-500" : (localTeam.overall_weighted_score ?? 0) > 0 ? "text-rose-500" : "text-slate-200"
                       )}>
                         {(localTeam.overall_weighted_score || 0).toFixed(1)}
                       </span>
                       <span className="text-xl font-bold text-slate-300">/ 5.0</span>
                    </div>
                  </div>
                  <div className="h-16 w-px bg-slate-100" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Benchmark Stage</span>
                    <span className="text-xl font-black text-slate-900 leading-none">{localTeam.detected_stage || 'IDEA'}</span>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase mt-2">Active Strategic Roadmap Gen</span>
                  </div>
               </div>

               <div className="flex flex-col items-end gap-3 text-right">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Assigned Support</span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">General Mentor</span>
                  </div>
               </div>
             </div>

             <SectionTabs activeTab={activeSection} setActiveTab={setActiveSection} />

             <div className="bg-white rounded-[32px] border border-slate-200 p-10 shadow-sm">
                {activeSection === 0 ? (
                  <Section1BasicInfo team={localTeam} onChange={scheduleUpdate} />
                ) : (
                  <ParameterSection
                    parameterId={PARAMETERS_CONFIG[activeSection - 1].id}
                    title={PARAMETERS_CONFIG[activeSection - 1].title}
                    subtitle={PARAMETERS_CONFIG[activeSection - 1].subtitle}
                    weight={PARAMETERS_CONFIG[activeSection - 1].weight}
                    coreQs={PARAMETERS_CONFIG[activeSection - 1].coreQs}
                    deepDiveQs={PARAMETERS_CONFIG[activeSection - 1].deepDiveQs}
                    data={localTeam}
                    onChange={scheduleUpdate}
                  />
                )}
             </div>
           </div>
        </div>

        {/* Sidebar for Notes & Insights */}
        <aside className="w-[400px] border-l border-slate-200 bg-white flex flex-col overflow-hidden">
           <div className="p-8 border-b border-slate-100">
              <div className="flex items-center gap-3 text-slate-900">
                 <ShieldCheck size={20} className="text-[#E8A020]" />
                 <h3 className="font-black tracking-tight leading-none pt-0.5">Admin Internal Protocol</h3>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                   Internal Oversight Notes
                   <span className="text-[8px] bg-slate-100 px-2 py-0.5 rounded text-slate-400">Strictly Private</span>
                </label>
                <textarea 
                  className="w-full h-40 bg-slate-50 border border-slate-100 rounded-[24px] p-6 text-sm font-medium text-slate-700 outline-none focus:bg-white focus:border-amber-100 focus:ring-4 focus:ring-amber-50/50 transition-all resize-none shadow-inner"
                  placeholder="Insert sensitive observations, risk analysis, or internal growth benchmarks..."
                  value={localTeam.admin_notes || ''}
                  onChange={e => scheduleUpdate('admin_notes', e.target.value)}
                />
              </div>

              <div className="bg-slate-900 rounded-[32px] p-6 text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                 <div className="relative z-10 space-y-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-amber-500">
                       <Sparkles size={18} />
                    </div>
                    <div>
                       <h4 className="text-sm font-black tracking-tight">AI Strategy Insight</h4>
                       <p className="text-[#8A9BB0] text-[11px] leading-relaxed mt-1">Based on the current weights, this venture is trending toward a Tier 3 Validation stage.</p>
                    </div>
                    <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                       Regenerate AI Audit
                    </button>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                   <span>Cohort Readiness</span>
                   <span>65%</span>
                 </div>
                 <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div className="h-full w-[65%] bg-amber-500 rounded-full" />
                 </div>
              </div>
           </div>
        </aside>
      </div>
    </div>
  )
}
