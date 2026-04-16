'use client'

import React, { useState, useEffect } from 'react'
import { useTeams, useCreateTeam, useDeleteTeam } from '@/hooks/useTeams'
import { useUIStore } from '@/store/uiStore'
import { calculateScores, scoreBg, scoreColor } from '@/utils/scores'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import { LogOut, User as UserIcon, Shield } from 'lucide-react'

export default function Sidebar() {
  const router = useRouter()
  const { data: teams = [], isLoading } = useTeams()
  const createTeam = useCreateTeam()
  const deleteTeam = useDeleteTeam()
  const { activeTeamId, setActiveTeamId } = useUIStore()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowser()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  async function handleLogout() {
    const supabase = getSupabaseBrowser()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

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

  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const userRole = user?.user_metadata?.role || 'Administrator'

  return (
    <aside style={{
      width: 210,
      background: '#fff',
      borderRight: '1px solid #E2E8F0',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      {/* Header with Add button */}
      <div style={{ padding: '16px 12px', borderBottom: '1px solid #E2E8F0' }}>
        <button
          onClick={handleAddTeam}
          disabled={createTeam.isPending}
          className="btn-hover"
          style={{
            width: '100%',
            padding: '10px 0',
            background: createTeam.isPending ? '#94A3B8' : '#0F172A',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 700,
            cursor: createTeam.isPending ? 'wait' : 'pointer',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
          }}
        >
          {createTeam.isPending ? 'Creating...' : '+ New Team'}
        </button>
      </div>

      {/* Team list */}
      <div className="custom-scrollbar" style={{ overflowY: 'auto', flex: 1, padding: 8 }}>
        {isLoading ? (
          <div style={{
            padding: 24,
            textAlign: 'center',
            color: '#94A3B8',
            fontSize: 11,
            fontWeight: 500,
          }}>
            Loading profiles...
          </div>
        ) : teams.length === 0 ? (
          <div style={{
            padding: 24,
            textAlign: 'center',
            color: '#94A3B8',
            fontSize: 11,
            lineHeight: 1.6,
          }}>
            No startup profiles.<br />
            Use <span style={{ fontWeight: 700, color: '#0F172A' }}>+ New Team</span> to begin.
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
                className="btn-hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  marginBottom: 4,
                  background: isActive ? '#0F172A' : (isHovered ? '#F1F5F9' : 'transparent'),
                  position: 'relative',
                  border: isActive ? '1px solid #0F172A' : '1px solid transparent',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 800,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: isActive ? '#fff' : '#0F172A',
                    letterSpacing: '-0.01em',
                  }}>
                    {team.teamName || 'Unnamed Team'}
                  </div>
                  <div style={{
                    fontSize: 10,
                    color: isActive ? '#94A3B8' : '#94A3B8',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginTop: 1,
                  }}>
                    {team.startupName || 'No startup name'}
                  </div>
                </div>

                {scores.overall !== null && (
                  <span style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '3px 6px',
                    borderRadius: 6,
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
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: isHovered ? 1 : 0,
                    color: '#EF4444',
                    fontSize: 14,
                    padding: '4px',
                    borderRadius: 6,
                    transition: 'all 0.2s',
                  }}
                >
                  ✕
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* User Footer Section */}
      <div style={{
        padding: '16px 12px',
        background: '#F8FAFC',
        borderTop: '1px solid #E2E8F0',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 12,
          padding: '4px',
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: '#0F172A',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <UserIcon size={18} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 11,
              fontWeight: 800,
              color: '#0F172A',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: 1.2,
            }}>
              {userDisplayName}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 9,
              fontWeight: 600,
              color: '#64748B',
              marginTop: 2,
            }}>
              <Shield size={10} className="text-amber-500" />
              {userRole.toUpperCase()}
            </div>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="btn-hover"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '8px 0',
            background: 'rgba(239, 68, 68, 0.05)',
            color: '#EF4444',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 8,
            fontSize: 10,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <LogOut size={12} />
          SIGN OUT
        </button>
      </div>
    </aside>
  )
}
