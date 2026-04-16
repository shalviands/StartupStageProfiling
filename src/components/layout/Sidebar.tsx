'use client'

import React, { useState } from 'react'
import { useTeams, useCreateTeam, useDeleteTeam } from '@/hooks/useTeams'
import { useUIStore } from '@/store/uiStore'
import { calculateScores, scoreBg, scoreColor } from '@/utils/scores'

export default function Sidebar() {
  const { data: teams = [], isLoading } = useTeams()
  const createTeam = useCreateTeam()
  const deleteTeam = useDeleteTeam()
  const { activeTeamId, setActiveTeamId } = useUIStore()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  async function handleAddTeam() {
    if (createTeam.isPending) return
    try {
      const newTeam = await createTeam.mutateAsync({
        teamName: 'New Team',
        startupName: '',
        roadmap: [
          { priority: 'P0' as const, action: '', supportFrom: '', byWhen: '' },
          { priority: 'P0' as const, action: '', supportFrom: '', byWhen: '' },
          { priority: 'P1' as const, action: '', supportFrom: '', byWhen: '' },
          { priority: 'P2' as const, action: '', supportFrom: '', byWhen: '' },
        ],
      })
      setActiveTeamId(newTeam.id)
    } catch (err) {
      console.error('[Sidebar] Add team failed:', err)
    }
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm('Delete this team profile?')) return
    try {
      if (activeTeamId === id) setActiveTeamId(null)
      await deleteTeam.mutateAsync(id)
    } catch (err) {
      console.error('[Sidebar] Delete failed:', err)
    }
  }

  return (
    <aside style={{
      width: 200,
      background: '#fff',
      borderRight: '1px solid #DDE3EC',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      {/* Header with Add button */}
      <div style={{ padding: 9, borderBottom: '1px solid #DDE3EC' }}>
        <button
          onClick={handleAddTeam}
          disabled={createTeam.isPending}
          style={{
            width: '100%',
            padding: '7px 0',
            background: createTeam.isPending ? '#8A9BB0' : '#0F2647',
            color: '#fff',
            border: 'none',
            borderRadius: 7,
            fontSize: 12,
            fontWeight: 600,
            cursor: createTeam.isPending ? 'wait' : 'pointer',
            transition: 'background 0.15s',
          }}
        >
          {createTeam.isPending ? 'Creating...' : '+ New Team'}
        </button>
      </div>

      {/* Team list */}
      <div style={{ overflowY: 'auto', flex: 1, padding: 7 }}>
        {isLoading ? (
          <div style={{
            padding: 16,
            textAlign: 'center',
            color: '#8A9BB0',
            fontSize: 11,
          }}>
            Loading...
          </div>
        ) : teams.length === 0 ? (
          <div style={{
            padding: 20,
            textAlign: 'center',
            color: '#8A9BB0',
            fontSize: 11,
          }}>
            No teams yet.<br />Click + New Team to start.
          </div>
        ) : (
          teams.map(team => {
            const scores = calculateScores(team)
            const isActive = team.id === activeTeamId
            const isHovered = hoveredId === team.id

            return (
              <div
                key={team.id}
                onClick={() => setActiveTeamId(team.id)}
                onMouseEnter={() => setHoveredId(team.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '7px 9px',
                  borderRadius: 7,
                  cursor: 'pointer',
                  marginBottom: 3,
                  background: isActive ? '#0F2647' : (isHovered ? '#F4F6F9' : 'transparent'),
                  transition: 'background 0.12s',
                  position: 'relative',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 700,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: isActive ? '#fff' : '#0F2647',
                  }}>
                    {team.teamName || 'Unnamed Team'}
                  </div>
                  <div style={{
                    fontSize: 9,
                    color: '#8A9BB0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {team.startupName || 'No startup name'}
                  </div>
                </div>

                {scores.overall !== null && (
                  <span style={{
                    fontSize: 9,
                    fontWeight: 700,
                    padding: '2px 5px',
                    borderRadius: 4,
                    flexShrink: 0,
                    background: scoreBg(scores.overall),
                    color: scoreColor(scores.overall),
                  }}>
                    {scores.overall}
                  </span>
                )}

                <button
                  onClick={e => handleDelete(team.id, e)}
                  style={{
                    position: 'absolute',
                    right: 6,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: isHovered ? 1 : 0,
                    color: '#E84B3A',
                    fontSize: 13,
                    padding: '2px 3px',
                    borderRadius: 4,
                    transition: 'opacity 0.12s',
                  }}
                >
                  ✕
                </button>
              </div>
            )
          })
        )}
      </div>
    </aside>
  )
}
