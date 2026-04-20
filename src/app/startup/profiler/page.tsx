'use client'

import React, { useState, useEffect, useRef } from 'react'
import { PARAMETERS_CONFIG } from '@/config/parameters'
import { calculateOverallScore, classifyStage } from '@/utils/scores'
import SectionTabs from '@/components/form/SectionTabs'
import Section1BasicInfo from '@/components/form/Section1BasicInfo'
import Section1Character from '@/components/form/Section1Character'
import Section2CustomerDiscovery from '@/components/form/Section2CustomerDiscovery'
import Section3ProductTRL from '@/components/form/Section3ProductTRL'
import Section4Differentiation from '@/components/form/Section4Differentiation'
import Section5Market from '@/components/form/Section5Market'
import Section6BusinessModel from '@/components/form/Section6BusinessModel'
import Section7Traction from '@/components/form/Section7Traction'
import Section8Team from '@/components/form/Section8Team'
import Section9Moats from '@/components/form/Section9Moats'
import { TeamProfile } from '@/types/team.types'
import { cn } from '@/utils/cn'
import { AlertCircle, Loader2, Save, Send, ChevronLeft, ChevronRight, Rocket } from 'lucide-react'
import { useTeams, useUpdateTeam, useCreateTeam } from '@/hooks/useTeams'
import ProgressTracker from '@/components/startup/ProgressTracker'
import { useRouter } from 'next/navigation'

export default function StartupProfilePage() {
  const router = useRouter()
  const { data: teams = [], isLoading } = useTeams()
  const createTeam = useCreateTeam()
  const updateTeam = useUpdateTeam()
  
  const [activeTab, setActiveTab] = useState(0)
  const [localTeam, setLocalTeam] = useState<TeamProfile | null>(null)
  const [saving, setSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Strict entry gating: Do not auto-create entries
  const [needsName, setNeedsName] = useState(false)
  const [draftStartupName, setDraftStartupName] = useState('')

  useEffect(() => {
    if (isLoading) return
    setError(null)
    
    // Only set localTeam if we don't have one yet or if there's no active draft being edited
    if (localTeam || needsName) return

    if (teams.length > 0) {
      const draft = teams.find(t => t.submission_status === 'draft')
      
      if (draft) {
        setLocalTeam(draft)
      } else {
        // Prompt for startup name instead of auto creating blindly to prevent empty drafts
        setNeedsName(true)
      }
    } else {
      // Prevent multiple creations
      if (createTeam.isPending) return
      setNeedsName(true)
    }
  }, [teams, isLoading, localTeam, createTeam.isPending, needsName])

  async function handleCreateDraft(e: React.FormEvent) {
    e.preventDefault()
    if (!draftStartupName.trim()) return

    const latest = teams[0]
    const submissionNum = teams.length > 0 ? teams.length + 1 : 1

    createTeam.mutateAsync({
      teamName: `Submission #${submissionNum}`,
      startupName: draftStartupName.trim(),
      sector: latest?.sector || '',
      submission_status: 'draft'
    })
    .then(newTeam => {
      setLocalTeam(newTeam)
      setNeedsName(false)
    })
    .catch(err => {
      console.error('[StartupProfile] Init failed:', err)
      setError('Failed to initialise your profiling session. Please ensure your account is approved and try again.')
    })
  }

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isSubmittedRef = useRef(false)

  function handleDataChange(field: string, value: any) {
    if (!localTeam || isSubmittedRef.current) return
    
    const nextTeam = { ...localTeam, [field]: value }
    const { stage, level } = classifyStage(nextTeam)
    const { overall, isBonusActive } = calculateOverallScore(nextTeam)

    const updated = { 
      ...nextTeam, 
      detected_stage: stage,
      overall_weighted_score: overall
    }
    
    setLocalTeam(updated)
    
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      if (isSubmittedRef.current) return
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
        console.error('[StartupProfile] AutoSave failed:', err)
      } finally {
        setSaving(false)
      }
    }, 600) // Corrected v2.0 debounce: 600ms
  }

  async function handleSubmit() {
    if (!localTeam || isSubmitting) return
    setIsSubmitting(true)
    isSubmittedRef.current = true
    
    try {
      if (saveTimer.current) clearTimeout(saveTimer.current)

      // Send the entire localTeam payload to the submit endpoint to ensure all debounced changes are flushed
      const res = await fetch('/api/startup/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_id: localTeam.id, team_data: localTeam })
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        isSubmittedRef.current = false
        throw new Error(data?.error || `HTTP error ${res.status}`)
      }

      // Redirect to new Success Page per Blueprint v2.0
      router.push(`/startup/submissions/success?number=${localTeam.submission_number || 1}`)
    } catch (err: any) {
      console.error('[StartupProfile] Submit failed:', err)
      const errorMsg = err instanceof Error ? err.message : 'Unknown network failure'
      alert(`Submission failed: ${errorMsg}. Please try again later.`)
      setIsSubmitting(false)
      isSubmittedRef.current = false
    }
  }

  if (error) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center gap-6">
      <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center">
        <AlertCircle size={36} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-navy tracking-tight">Sync Failure</h2>
        <p className="text-sm text-slate font-medium max-w-sm mx-auto leading-relaxed">
          {error}
        </p>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="bg-navy text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-navy/20"
      >
        Retry Initialisation
      </button>
    </div>
  )

  if (needsName) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-smoke/20 rounded-[40px] m-6 border border-rule/50">
      <div className="w-20 h-20 bg-navy text-gold rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-navy/20">
        <Rocket size={36} />
      </div>
      <h2 className="text-3xl font-black text-navy tracking-tight mb-2">Launch New Profile</h2>
      <p className="text-sm text-slate font-medium max-w-sm mx-auto leading-relaxed mb-8">
        Required: What is the registered or provisional name of your tech venture?
      </p>
      
      <form onSubmit={handleCreateDraft} className="w-full max-w-sm mx-auto space-y-4">
         <input 
           type="text"
           required
           autoFocus
           value={draftStartupName}
           onChange={e => setDraftStartupName(e.target.value)}
           placeholder="e.g. InUnity Strategic Systems"
           className="w-full px-6 py-4 rounded-2xl border border-rule bg-white text-navy font-bold text-center placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-all shadow-sm text-lg"
         />
         <button 
           type="submit"
           disabled={!draftStartupName.trim() || createTeam.isPending}
           className="w-full bg-navy text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-navy/20 disabled:opacity-50 flex items-center justify-center gap-3"
         >
           {createTeam.isPending ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
           {createTeam.isPending ? 'Initialising...' : 'Start Profiling Session'}
         </button>
         <button 
           type="button"
           onClick={() => router.push('/startup')}
           className="w-full text-slate text-[10px] font-black uppercase tracking-widest hover:text-navy transition-colors py-2"
         >
           ← Back to Dashboard
         </button>
      </form>
    </div>
  )

  if (isLoading || !localTeam) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-silver">
      <Loader2 className="animate-spin" size={32} />
      <span className="text-[10px] font-black uppercase tracking-widest tracking-[0.3em]">Initialising Session...</span>
    </div>
  )

  const renderActiveSection = () => {
    switch (activeTab) {
      case 0: return <Section1BasicInfo team={localTeam} onChange={handleDataChange} />
      case 1: return <Section1Character data={localTeam} onChange={handleDataChange} readOnlyScores={true} />
      case 2: return <Section2CustomerDiscovery data={localTeam} onChange={handleDataChange} readOnlyScores={true} />
      case 3: return <Section3ProductTRL data={localTeam} onChange={handleDataChange} readOnlyScores={true} />
      case 4: return <Section4Differentiation data={localTeam} onChange={handleDataChange} readOnlyScores={true} />
      case 5: return <Section5Market data={localTeam} onChange={handleDataChange} readOnlyScores={true} />
      case 6: return <Section6BusinessModel data={localTeam} onChange={handleDataChange} readOnlyScores={true} />
      case 7: return <Section7Traction data={localTeam} onChange={handleDataChange} readOnlyScores={true} />
      case 8: return <Section8Team data={localTeam} onChange={handleDataChange} readOnlyScores={true} />
      case 9: return <Section9Moats data={localTeam} onChange={handleDataChange} readOnlyScores={true} />
      default: return <Section1BasicInfo team={localTeam} onChange={handleDataChange} />
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 pb-32">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/startup/submissions')}
            className="w-12 h-12 rounded-2xl border border-rule flex items-center justify-center text-slate-500 hover:text-navy hover:bg-white transition-all shadow-sm bg-white"
            title="Back to Submissions"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => router.push('/startup/submissions')}
            className="w-12 h-12 rounded-2xl border border-rule flex items-center justify-center text-slate-500 hover:text-navy hover:bg-white transition-all shadow-sm bg-white"
            title="Go Home"
          >
            <Rocket size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-navy tracking-tight mb-2">Startup Stage Profiler</h1>
            <p className="text-slate font-bold uppercase text-[10px] tracking-widest opacity-60">Strategic 9-Parameter Venture Assessment</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {saving && (
            <div className="flex items-center gap-2 text-silver text-[9px] font-black uppercase tracking-wider bg-white px-4 py-2 rounded-full border border-rule shadow-sm animate-pulse">
               <Save size={12} className="text-teal" /> Cloud Syncing...
            </div>
          )}
          <div className="bg-white border border-rule px-5 py-2.5 rounded-2xl flex flex-col items-end shadow-sm">
             <span className="text-[9px] font-black text-silver uppercase tracking-wider">Draft Baseline</span>
             <span className="text-xl font-black text-navy">{(localTeam.overall_weighted_score || 0).toFixed(1)}</span>
          </div>
        </div>
      </div>

      <ProgressTracker team={localTeam} activeSection={activeTab} />

      <SectionTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="bg-white rounded-[40px] border border-rule p-8 md:p-14 mb-10 shadow-xl shadow-navy/5 min-h-[600px] transition-all duration-500">
        {renderActiveSection()}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between mt-12 bg-smoke/50 backdrop-blur-md p-6 rounded-3xl border border-rule/50">
        <button
          onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
          disabled={activeTab === 0}
          className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-silver hover:text-navy disabled:opacity-20 transition-all group px-4 py-2"
        >
          <div className="w-12 h-12 rounded-2xl border border-rule flex items-center justify-center bg-white group-hover:bg-navy group-hover:text-white group-hover:border-navy transition-all shadow-sm">
            <ChevronLeft size={18} />
          </div>
          <span>Previous Phase</span>
        </button>

        {activeTab < 9 ? (
          <button
            onClick={() => setActiveTab(activeTab + 1)}
            className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-navy hover:tracking-[0.3em] transition-all group px-4 py-2"
          >
            <span>Process P{activeTab + 1}</span>
            <div className="w-12 h-12 rounded-2xl bg-navy text-gold flex items-center justify-center group-hover:scale-110 transition-all shadow-lg shadow-navy/20">
              <ChevronRight size={18} />
            </div>
          </button>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-4 bg-navy text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-xl shadow-navy/20 group"
          >
            <Send size={16} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            Submit Final Profile
          </button>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-md" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-gold-lt rounded-3xl flex items-center justify-center text-gold mb-8 mx-auto shadow-inner">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-2xl font-black text-navy text-center mb-4 tracking-tight">Finalise Profiling?</h3>
            <p className="text-slate text-center text-sm font-semibold leading-relaxed mb-10">
              Once submitted, your baseline profile will be locked for review. 
              The InUnity team will finalise your strategic profile based on this evidence.
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-navy text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-navy/20"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'Lock & Confirm Submission'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isSubmitting}
                className="w-full bg-smoke text-silver py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rule transition-all"
              >
                Back to Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
