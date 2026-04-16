'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useUIStore } from '@/store/uiStore'
import { useTeams, useUpdateTeam } from '@/hooks/useTeams'
import SectionTabs from '@/components/form/SectionTabs'
import Section1BasicInfo from '@/components/form/Section1BasicInfo'
import Section2ProblemSolution from '@/components/form/Section2ProblemSolution'
import Section3MarketValidation from '@/components/form/Section3MarketValidation'
import Section4BusinessModel from '@/components/form/Section4BusinessModel'
import Section5Readiness from '@/components/form/Section5Readiness'
import Section6Pitch from '@/components/form/Section6Pitch'
import Section7Diagnosis from '@/components/form/Section7Diagnosis'
import LivePreview from '@/components/preview/LivePreview'
import AIAnalysisPanel from '@/components/ai/AIAnalysisPanel'
import { Loader2, ChevronRight, ChevronLeft, Save } from 'lucide-react'
import type { TeamProfile } from '@/types/team.types'

export default function ProfilerPage() {
  const { activeTeamId, activeSection, setSection, showPreview } = useUIStore()
  const { data: teams = [], isLoading } = useTeams()
  const { mutate: updateTeam } = useUpdateTeam()
  
  const activeTeam = teams.find(t => t.id === activeTeamId) ?? null

  const [localTeam, setLocalTeam] = useState<TeamProfile | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Sync local state when active team changes
  useEffect(() => {
    if (activeTeam) {
      setLocalTeam(activeTeam)
    } else {
      setLocalTeam(null)
    }
  }, [activeTeamId, teams]) // Careful with dependencies to avoid loops

  // Debounced Auto-save
  useEffect(() => {
    if (!localTeam || !activeTeamId) return
    
    // Check if anything actually changed using a simple ID + timestamp or value check
    const original = teams.find(t => t.id === activeTeamId)
    if (!original) return

    // Shallow compare relevant fields to see if we need a save
    const hasChanged = Object.keys(localTeam).some(key => {
      const k = key as keyof TeamProfile
      return JSON.stringify(localTeam[k]) !== JSON.stringify(original[k])
    })

    if (!hasChanged) return

    const timer = setTimeout(() => {
      setIsSaving(true)
      updateTeam({ id: activeTeamId, updates: localTeam }, {
        onSettled: () => {
          setIsSaving(false)
        }
      })
    }, 1500) // Increased debounce for better UX and less DB load

    return () => clearTimeout(timer)
  }, [localTeam, activeTeamId, teams])

  const handleChange = useCallback((field: keyof TeamProfile, value: any) => {
    setLocalTeam(prev => prev ? ({ ...prev, [field]: value }) : null)
  }, [])

  const handleScoreChange = useCallback((field: keyof TeamProfile, value: number) => {
    setLocalTeam(prev => prev ? ({ ...prev, [field]: value }) : null)
  }, [])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-smoke">
        <Loader2 className="animate-spin text-navy" size={40} />
      </div>
    )
  }

  if (!activeTeamId || !localTeam) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-smoke p-8 text-center">
        <div className="w-20 h-20 bg-white rounded-3xl border border-rule flex items-center justify-center mb-6 shadow-xl shadow-navy/5">
           <Save size={32} className="text-silver" />
        </div>
        <h2 className="text-xl font-black text-navy mb-2">No Profile Selected</h2>
        <p className="text-silver text-sm max-w-xs leading-relaxed">
          Select an existing startup profile from the sidebar or create a new one to begin diagnosis.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 overflow-hidden bg-smoke font-sans">
      {/* LEFT: Form Flow */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <SectionTabs />
        
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          {isSaving && (
             <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-navy text-gold px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                <Loader2 size={12} className="animate-spin" />
                Syncing Changes...
             </div>
          )}

          <div className="max-w-4xl mx-auto">
            {activeSection === 0 && <Section1BasicInfo team={localTeam} onChange={handleChange} />}
            {activeSection === 1 && <Section2ProblemSolution team={localTeam} onChange={handleChange} onScoreChange={handleScoreChange} />}
            {activeSection === 2 && <Section3MarketValidation team={localTeam} onChange={handleChange} onScoreChange={handleScoreChange} />}
            {activeSection === 3 && <Section4BusinessModel team={localTeam} onChange={handleChange} onScoreChange={handleScoreChange} />}
            {activeSection === 4 && <Section5Readiness team={localTeam} onChange={handleChange} />}
            {activeSection === 5 && <Section6Pitch team={localTeam} onChange={handleChange} onScoreChange={handleScoreChange} />}
            {activeSection === 6 && <Section7Diagnosis team={localTeam} onChange={handleChange} />}
          </div>
        </div>

        {/* Form Navigation Bar */}
        <div className="p-4 bg-white border-t border-rule flex justify-between items-center sm:px-8">
           <button 
             disabled={activeSection === 0}
             onClick={() => setSection(activeSection - 1)}
             className="flex items-center gap-2 text-[10px] font-black text-silver uppercase tracking-widest hover:text-navy disabled:opacity-0 transition-all font-sans"
           >
             <ChevronLeft size={16} /> Back
           </button>
           
           <div className="flex items-center gap-1.5">
              {[0,1,2,3,4,5,6].map(i => (
                <div key={i} className={`h-1 rounded-full transition-all ${activeSection === i ? 'w-8 bg-navy' : 'w-2 bg-smoke'}`} />
              ))}
           </div>

           <button 
             disabled={activeSection === 6}
             onClick={() => setSection(activeSection + 1)}
             className="flex items-center gap-2 text-[10px] font-black text-navy uppercase tracking-widest hover:text-gold disabled:opacity-0 transition-all font-sans"
           >
             Next Section <ChevronRight size={16} />
           </button>
        </div>
      </div>

      {/* RIGHT: Live Preview Panel */}
      {showPreview && (
        <aside className="w-[320px] border-l border-rule bg-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          <LivePreview team={localTeam} />
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AIAnalysisPanel teamId={activeTeamId} />
          </div>
        </aside>
      )}
    </div>
  )
}
