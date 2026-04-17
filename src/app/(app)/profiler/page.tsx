'use client'

import React, { useState, useEffect, useRef } from 'react'
import { PARAMETERS_CONFIG } from '@/config/parameters'
import { calculateOverallScore, classifyStage, getMentorType, getRoadmap } from '@/utils/scores'
import SectionTabs from '@/components/form/SectionTabs'
import Section1BasicInfo from '@/components/form/Section1BasicInfo'
import ParameterSection from '@/components/form/ParameterSection'
import AIAnalysisPanel from '@/components/ai/AIAnalysisPanel'
import { TeamProfile } from '@/types/team.types'
import { cn } from '@/utils/cn'
import { AlertCircle, CheckCircle2, MoreHorizontal, ShieldCheck, TrendingUp, Zap, FileText, Download, Sparkles, AlertTriangle, Loader2, Save } from 'lucide-react'
import { useTeams, useUpdateTeam, useCreateTeam, useDeleteTeam } from '@/hooks/useTeams'
import { useUIStore } from '@/store/uiStore'
import { useDebounce } from '@/hooks/useDebounce'
import dynamic from 'next/dynamic'
import PDFDownloadButton from '@/components/pdf/PDFDownloadButton'
import AIAssistantDrawer from '@/components/ai/AIAssistantDrawer'
const ExcelDownloadButton = dynamic(() => import('@/components/excel/ExcelDownloadButton'), { ssr: false })

// --- Stage Detection Banner ---
function StageBanner({ 
  team, 
  saving,
  onExplain 
}: { 
  team: TeamProfile, 
  saving: boolean,
  onExplain: () => void
}) {
  const { stage, level, override, p9Bonus } = classifyStage(team)
  const { overall } = calculateOverallScore(team)
  
  return (
    <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm backdrop-blur-md bg-white/90">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Detected Stage</span>
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-1.5 rounded-lg",
              level >= 4 ? "bg-emerald-100 text-emerald-700" : level >= 2 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"
            )}>
              {level >= 4 ? <Zap size={18} /> : level >= 2 ? <TrendingUp size={18} /> : <AlertCircle size={18} />}
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{stage}</h3>
            <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-300 uppercase">Tier {level}</span>
            <button 
              onClick={onExplain}
              className="ml-2 flex items-center gap-1.5 text-[9px] font-black text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-xl border border-violet-100 transition-all group"
            >
              Why this stage?
              <Sparkles size={10} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>

        {override && (
          <div className="h-10 w-px bg-slate-200 mx-2" />
        )}

        {override && (
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <AlertCircle size={10} /> Progress Capped By
            </span>
            <span className="text-sm font-bold text-slate-700">{override}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Weighted Score</span>
          <div className="flex items-baseline gap-1">
             <span className={cn(
               "text-2xl font-black tabular-nums",
               overall >= 4 ? "text-emerald-600" : overall >= 3 ? "text-amber-500" : overall > 0 ? "text-rose-500" : "text-slate-300"
             )}>
               {overall > 0 ? overall.toFixed(1) : '--'}
             </span>
             <span className="text-xs font-bold text-slate-300">/ 5.0</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
           {p9Bonus && (
             <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-100 animate-pulse transition-all">
               <ShieldCheck size={14} />
               <span className="text-[10px] font-black uppercase tracking-wider">Moat Active</span>
             </div>
           )}
           <div className="h-10 w-px bg-slate-100 mx-1" />
           <div className="flex items-center gap-2">
             <ExcelDownloadButton team={team} />
             <PDFDownloadButton team={team} />
           </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilerPage() {
  const { data: teams = [], isLoading, error, isError, refetch } = useTeams()
  const createTeam  = useCreateTeam()
  const updateTeam  = useUpdateTeam()
  const deleteTeam  = useDeleteTeam()
  const {
    activeTeamId,
    activeSection,
    showPreview,
    setActiveTeamId,
    setSection,
  } = useUIStore()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<'explanation' | 'roadmap'>('explanation')

  const activeTeam: TeamProfile | null = activeTeamId
    ? (teams.find(t => t.id === activeTeamId) ?? null)
    : null

  const [localTeam, setLocalTeam] = useState<TeamProfile | null>(null)

  useEffect(() => {
    if (activeTeam) setLocalTeam(activeTeam)
    else setLocalTeam(null)
  }, [activeTeamId, activeTeam])

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  function scheduleUpdate(field: string, value: any) {
    if (!activeTeamId || !localTeam) return
    
    // 1. Calculate derivatives client-side for instant sync
    const nextTeam = { ...localTeam, [field]: value }
    const { stage, level } = classifyStage(nextTeam)
    const { overall, isBonusActive } = calculateOverallScore(nextTeam)
    const mentor = getMentorType(stage)
    const roadmap = getRoadmap(nextTeam)

    const updated = { 
      ...nextTeam, 
      detected_stage: stage,
      overall_weighted_score: overall,
      p9_bonus_active: isBonusActive,
      assigned_mentor_type: mentor,
    }
    
    setLocalTeam(updated)
    
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaving(true)
      setSaveError('')
      try {
        const updates = { 
          [field]: value,
          detected_stage: stage,
          overall_weighted_score: overall,
          p9_bonus_active: isBonusActive,
          assigned_mentor_type: mentor
        }
        await updateTeam.mutateAsync({ id: activeTeamId, updates })
      } catch (err) {
        setSaveError('Save failed')
        console.error('[AutoSave]', err)
      } finally {
        setSaving(false)
      }
    }, 600)
  }

  async function handleAddTeam() {
    try {
      const newTeam = await createTeam.mutateAsync({
        teamName: 'New Diagnostic Session',
        startupName: '',
        sector: '',
        p8_team_members: [],
        detected_stage: 'IDEA / CONCEPTION',
        overall_weighted_score: 0,
        p9_bonus_active: false
      })
      setActiveTeamId(newTeam.id)
      setSection(0)
    } catch (err) {
      console.error('[handleAddTeam]', err)
      alert('Failed to create profile. Please try again.')
    }
  }

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400 text-sm font-medium">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
        Syncing Diagnosis Engine...
      </div>
    </div>
  )

  if (isError) {
    const isAuthError = error instanceof Error && error.message.includes('authenticated')
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-8 text-center">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
          <AlertTriangle size={36} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          {isAuthError ? 'Session Expired' : 'Sync Error'}
        </h2>
        <p className="text-slate-500 max-w-sm mb-8 font-medium">
          {isAuthError 
            ? 'Your authentication session has expired or is invalid. Please refresh to restore access.'
            : 'We encountered an error while syncing with the server. Please check your connection.'
          }
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => refetch()}
            className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            Retry Sync
          </button>
          {isAuthError && (
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-white text-slate-900 border border-slate-200 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 overflow-hidden bg-slate-50">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Banner */}
        {localTeam && (
          <StageBanner 
            team={localTeam} 
            saving={saving} 
            onExplain={() => {
              setDrawerMode('explanation')
              setDrawerOpen(true)
            }}
          />
        )}

        {/* Navigation Tabs */}
        {localTeam && <SectionTabs activeTab={activeSection} setActiveTab={setSection} />}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-8 py-12">
          {!localTeam ? (
            <div className="h-full flex flex-col items-center justify-center gap-6 text-center max-w-sm mx-auto">
              <div className="w-24 h-24 bg-white rounded-[40px] shadow-2xl shadow-slate-200 flex items-center justify-center text-4xl transform -rotate-6 hover:rotate-0 transition-all duration-500">
                📋
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Zero Sessions Selected</h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Select an existing startup diagnosis profile from the sidebar or launch a new session to begin.
                </p>
              </div>
              <button 
                onClick={handleAddTeam}
                className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
              >
                + New Diagnosis Session
              </button>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-100">
              {activeSection === 0 ? (
                <Section1BasicInfo
                  team={localTeam}
                  onChange={scheduleUpdate}
                />
              ) : (
                <ParameterSection 
                  key={activeSection}
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
          )}
        </div>

        {/* Navigation Footer */}
        {localTeam && (
          <div className="bg-white border-t border-slate-200 px-8 py-5 flex items-center justify-between z-10">
            <button
              onClick={() => setSection(Math.max(0, activeSection - 1))}
              disabled={activeSection === 0}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 disabled:opacity-20 transition-all group"
            >
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-50">←</div> 
              Back
            </button>
            
            <div className="flex items-center gap-4">
               {Array.from({ length: 10 }).map((_, i) => (
                 <div key={i} className={cn(
                   "w-1.5 h-1.5 rounded-full transition-all duration-500",
                   i === activeSection ? "bg-slate-900 scale-150 w-4 rounded-sm" : i < activeSection ? "bg-slate-300" : "bg-slate-100"
                 )} />
               ))}
            </div>

            <button
               onClick={() => setSection(Math.min(9, activeSection + 1))}
               disabled={activeSection === 9}
               className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 hover:tracking-[.25em] disabled:opacity-20 transition-all group"
            >
              {activeSection === 9 ? 'Diagnosis Finalized' : 'Continue'}
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform">→</div>
            </button>
          </div>
        )}
      </div>

      {/* Preview Panel */}
      {showPreview && localTeam && (
        <aside className="w-[420px] bg-white border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-500">
           <div className="flex-1 overflow-y-auto">
             <AIAnalysisPanel teamId={localTeam.id} />
           </div>
        </aside>
      {/* AI Assistant Drawer */}
      {localTeam && (
        <AIAssistantDrawer 
          isOpen={drawerOpen}
          mode={drawerMode}
          onClose={() => setDrawerOpen(false)}
          team={localTeam}
        />
      )}
    </div>
  )
}
