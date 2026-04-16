'use client'

import React, { useState, useEffect, useRef } from 'react'
import { PARAMETERS_CONFIG } from '@/config/parameters'
import { calculateOverallScore, classifyStage } from '@/utils/scores'
import SectionTabs from '@/components/form/SectionTabs'
import Section1BasicInfo from '@/components/form/Section1BasicInfo'
import ParameterSection from '@/components/form/ParameterSection'
import { TeamProfile } from '@/types/team.types'
import { cn } from '@/utils/cn'
import { AlertCircle, CheckCircle2, Loader2, Save, Send } from 'lucide-react'
import { useTeams, useUpdateTeam, useCreateTeam } from '@/hooks/useTeams'
import { useDebounce } from '@/hooks/useDebounce'
import ProgressTracker from '@/components/startup/ProgressTracker'
import { useRouter } from 'next/navigation'

export default function StartupProfilePage() {
  const router = useRouter()
  const { data: teams = [], isLoading } = useTeams()
  const createTeam = useCreateTeam()
  const updateTeam = useUpdateTeam()
  
  const [activeSection, setActiveSection] = useState(0)
  const [localTeam, setLocalTeam] = useState<TeamProfile | null>(null)
  const [saving, setSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // 1. Initialise or fetch the startup's single team
  useEffect(() => {
    if (isLoading) return

    if (teams.length > 0) {
      const team = teams[0]
      // If already submitted/finalised, send to submitted page
      if (team.submission_status !== 'draft') {
        router.push('/startup/submitted')
        return
      }
      setLocalTeam(team)
    } else {
      // Create the team if it doesn't exist
      createTeam.mutateAsync({
        teamName: 'Startup Profile',
        startupName: '',
        sector: '',
        submission_status: 'draft'
      }).then(newTeam => {
        setLocalTeam(newTeam)
      })
    }
  }, [teams, isLoading])

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function scheduleUpdate(field: string, value: any) {
    if (!localTeam) return
    
    const nextTeam = { ...localTeam, [field]: value }
    const { stage, level } = classifyStage(nextTeam)
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
            overall_weighted_score: overall,
            p9_bonus_active: isBonusActive
          } 
        })
      } catch (err) {
        console.error('[StartupProfile] AutoSave failed:', err)
      } finally {
        setSaving(false)
      }
    }, 600)
  }

  async function handleSubmit() {
    if (!localTeam) return
    setIsSubmitting(true)
    try {
      await updateTeam.mutateAsync({
        id: localTeam.id,
        updates: { submission_status: 'submitted' }
      })
      router.push('/startup/submitted')
    } catch (err) {
      console.error('[StartupProfile] Submit failed:', err)
      alert('Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !localTeam) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <Loader2 className="animate-spin" size={32} />
      <span className="text-sm font-bold uppercase tracking-widest">Loading Your Profile...</span>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Stat & Title */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Diagnosis Profile</h1>
          <p className="text-slate-500 font-medium">Core 9-Parameter Venture Assessment</p>
        </div>
        <div className="flex items-center gap-4">
          {saving && (
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm animate-pulse">
               <Save size={12} /> Saving...
            </div>
          )}
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl flex flex-col items-end">
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Draft Score</span>
             <span className="text-lg font-black text-slate-900">{(localTeam.overall_weighted_score || 0).toFixed(1)}</span>
          </div>
        </div>
      </div>

      <ProgressTracker team={localTeam} activeSection={activeSection} />

      <SectionTabs activeTab={activeSection} setActiveTab={setActiveSection} />

      <div className="bg-white rounded-[32px] border border-slate-200 p-8 md:p-12 mb-8 shadow-sm">
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

      {/* Navigation Footer */}
      <div className="flex items-center justify-between py-6">
        <button
          onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
          disabled={activeSection === 0}
          className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 disabled:opacity-20 transition-all group"
        >
          <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-50">←</div>
          <span>Previous</span>
        </button>

        {activeSection < 9 ? (
          <button
            onClick={() => setActiveSection(activeSection + 1)}
            className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-900 hover:tracking-[0.2em] transition-all group"
          >
            <span>Continue To P{activeSection + 1}</span>
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-slate-200 font-normal">→</div>
          </button>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 group active:scale-95"
          >
            <Send size={16} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            Submit Final Profile
          </button>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-6 mx-auto">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 text-center mb-3">Submit Final Diagnosis?</h3>
            <p className="text-slate-500 text-center text-sm leading-relaxed mb-8">
              Once submitted, you will no longer be able to edit your profile. 
              The InUnity team will review your data to finalise your diagnosis.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : 'Confirm & Submit'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isSubmitting}
                className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
