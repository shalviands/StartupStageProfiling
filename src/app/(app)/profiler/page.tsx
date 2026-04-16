'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTeams, useCreateTeam, useUpdateTeam, useDeleteTeam }
  from '@/hooks/useTeams'
import { useUIStore } from '@/store/uiStore'
import type { TeamProfile } from '@/types/team.types'
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

const SECTIONS = [
  Section1BasicInfo,
  Section2ProblemSolution,
  Section3MarketValidation,
  Section4BusinessModel,
  Section5Readiness,
  Section6Pitch,
  Section7Diagnosis,
]

export default function ProfilerPage() {
  const { data: teams = [], isLoading } = useTeams()
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

  // SAFE: always check before using
  const activeTeam: TeamProfile | null = activeTeamId
    ? (teams.find(t => t.id === activeTeamId) ?? null)
    : null

  // Auto-save: debounced 600ms
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  function scheduleUpdate(field: keyof TeamProfile, value: any) {
    if (!activeTeamId || !activeTeam) return
    
    // Optimistic local update check would go here if needed
    
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaving(true)
      setSaveError('')
      try {
        const updates = { [field]: value }
        await updateTeam.mutateAsync({ id: activeTeamId, updates })
      } catch (err) {
        setSaveError('Save failed')
        console.error('[AutoSave]', err)
      } finally {
        setSaving(false)
      }
    }, 600)
  }

  function handleScoreChange(field: keyof TeamProfile, value: number) {
    scheduleUpdate(field, value)
  }

  // Add team handler — safe with loading guard
  async function handleAddTeam() {
    try {
      const newTeam = await createTeam.mutateAsync({
        teamName: 'New Team',
        startupName: '',
        sector: '',
        roadmap: [
          { priority: 'P0' as const, action: '', supportFrom: '', byWhen: '' },
          { priority: 'P0' as const, action: '', supportFrom: '', byWhen: '' },
          { priority: 'P1' as const, action: '', supportFrom: '', byWhen: '' },
          { priority: 'P2' as const, action: '', supportFrom: '', byWhen: '' },
        ],
      })
      // Set active ONLY after the team is confirmed created
      setActiveTeamId(newTeam.id)
    } catch (err) {
      console.error('[handleAddTeam]', err)
      alert('Failed to create profile. Please try again.')
    }
  }

  const SectionComponent = SECTIONS[activeSection] ?? SECTIONS[0]

  // Show loading while initial data loads
  if (isLoading) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#8A9BB0',
        fontSize: 14,
        background: '#F4F6F9',
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: '#F4F6F9' }}>

      {/* ── FORM AREA ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Section tabs — only show when team selected */}
        {activeTeam && (
          <SectionTabs />
        )}

        {/* Form content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {!activeTeam ? (
            // No team selected state
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 12,
              color: '#8A9BB0',
            }}>
              <div style={{ fontSize: 48 }}>📋</div>
              <h2 style={{ color: '#0F2647', fontSize: 18, fontWeight: 700 }}>
                No profile selected
              </h2>
              <p style={{ fontSize: 13 }}>
                Select a startup profile from the sidebar or create a new one
              </p>
              <button
                onClick={handleAddTeam}
                disabled={createTeam.isPending}
                style={{
                  marginTop: 8,
                  padding: '8px 20px',
                  background: '#0F2647',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: createTeam.isPending ? 'wait' : 'pointer',
                }}
              >
                {createTeam.isPending ? 'Creating...' : '+ Add Profile'}
              </button>
            </div>
          ) : (
            // Active team form
            <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
               <SectionComponent
                team={activeTeam}
                onChange={scheduleUpdate}
                onScoreChange={handleScoreChange}
              />
            </div>
          )}
        </div>

        {/* Navigation footer — only show when team selected */}
        {activeTeam && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 24px',
            background: '#fff',
            borderTop: '1px solid #DDE3EC',
            flexShrink: 0,
          }}>
            <button
              onClick={() => setSection(activeSection - 1)}
              disabled={activeSection === 0}
              style={{
                padding: '8px 16px',
                border: '1px solid #DDE3EC',
                borderRadius: 8,
                background: '#fff',
                color: '#0F2647',
                fontSize: 12,
                fontWeight: 600,
                cursor: activeSection === 0 ? 'not-allowed' : 'pointer',
                opacity: activeSection === 0 ? 0.4 : 1,
              }}
            >
              Previous
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {saving && (
                <span style={{ fontSize: 11, color: '#8A9BB0' }}>Saving...</span>
              )}
              {saveError && (
                <span style={{ fontSize: 11, color: '#E84B3A' }}>⚠ {saveError}</span>
              )}
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0F2647' }}>
                {activeSection + 1} / {SECTIONS.length}
              </span>
            </div>
            <button
              onClick={() => setSection(activeSection + 1)}
              disabled={activeSection === SECTIONS.length - 1}
              style={{
                padding: '8px 16px',
                border: '1px solid #DDE3EC',
                borderRadius: 8,
                background: '#fff',
                color: '#0F2647',
                fontSize: 12,
                fontWeight: 600,
                cursor: activeSection === SECTIONS.length - 1 ? 'not-allowed' : 'pointer',
                opacity: activeSection === SECTIONS.length - 1 ? 0.4 : 1,
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ── PREVIEW PANEL ── */}
      {showPreview && activeTeam && (
        <aside style={{
          width: 320,
          borderLeft: '1px solid #DDE3EC',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <LivePreview team={activeTeam} />
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <AIAnalysisPanel teamId={activeTeam.id} />
          </div>
        </aside>
      )}

    </div>
  )
}
