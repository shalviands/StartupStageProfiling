'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/utils/cn'
import { calculateOverallScore, scoreBg, scoreColor } from '@/utils/scores'
import { useTeams, useCreateTeam, useDeleteTeam } from '@/hooks/useTeams'
import { useUIStore } from '@/store/uiStore'
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
    try {
      const supabase = getSupabaseBrowser()
      await supabase.auth.signOut()
      // Hard redirect to clear all internal state/cache
      window.location.href = '/login'
    } catch (err) {
      console.error('Logout failed:', err)
      router.push('/login')
    }
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm('Permanently delete this profiling session?')) return
    try {
      if (activeTeamId === id) setActiveTeamId(null)
      await deleteTeam.mutateAsync(id)
    } catch (err) {
      console.error('[Sidebar] Delete failed:', err)
    }
  }

  async function handleAddTeam() {
    if (createTeam.isPending) return
    try {
      const newTeam = await createTeam.mutateAsync({
        teamName: 'New Profiling Session',
        startupName: '',
        p8_team_members: [],
        detected_stage: 'IDEA / CONCEPTION',
        overall_weighted_score: 0
      })
      setActiveTeamId(newTeam.id)
    } catch (err) {
      console.error('[Sidebar] Add session failed:', err)
    }
  }

  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const userRole = user?.user_metadata?.role || 'Administrator'

  return (
    <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col flex-shrink-0 overflow-hidden shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
      {/* Header with Add button */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <button
          onClick={handleAddTeam}
          disabled={createTeam.isPending}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-md active:scale-95 group",
            createTeam.isPending ? "bg-slate-200 text-slate-400" : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200"
          )}
        >
          {createTeam.isPending ? (
            <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin" />
          ) : (
            '+ New Session'
          )}
        </button>
      </div>

      {/* Team list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center gap-3 text-slate-300">
            <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Syncing Records</span>
          </div>
        ) : teams.length === 0 ? (
          <div className="py-12 text-center px-4">
             <div className="text-2xl mb-2 opacity-20">📊</div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
               No active sessions<br/>found on record
             </p>
          </div>
        ) : (
          teams.map(team => {
            const { overall } = calculateOverallScore(team)
            const isActive = team.id === activeTeamId

            return (
              <div
                key={team.id}
                onClick={() => setActiveTeamId(team.id)}
                className={cn(
                  "p-4 rounded-2xl cursor-pointer relative group transition-all border",
                  isActive 
                    ? "bg-slate-900 border-slate-900 shadow-xl shadow-slate-200 translate-x-1" 
                    : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <div className="flex flex-col gap-2 min-w-0 pr-4">
                  <div className="flex justify-between items-start">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest truncate",
                      isActive ? "text-white/60" : "text-slate-500"
                    )}>
                      {team.teamName || 'Profiling Session'}
                    </span>
                    <span className={cn(
                      "text-[10px] font-black tabular-nums transition-colors",
                      isActive ? "text-white" : (overall >= 4 ? "text-emerald-600" : overall >= 3 ? "text-amber-500" : overall > 0 ? "text-rose-500" : "text-slate-200")
                    )}>
                      {overall > 0 ? overall.toFixed(1) : '--'}
                    </span>
                  </div>
                  
                  <h4 className={cn(
                    "text-[13px] font-bold truncate",
                    isActive ? "text-white" : "text-slate-900"
                  )}>
                    {team.startupName || 'Untitled Startup'}
                  </h4>

                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter transition-colors border",
                      isActive ? "bg-white/10 border-white/20 text-white/70" : "bg-slate-100 border-slate-200 text-slate-500"
                    )}>
                      {team.detected_stage ? team.detected_stage.split(' / ')[0] : 'IDEA'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={e => handleDelete(team.id, e)}
                  className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-rose-50 hover:text-rose-500 rounded-lg text-slate-400"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* User Footer Section */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 mt-auto">
        <div className="flex items-center gap-3 p-2 group cursor-default">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
            <UserIcon size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-black text-slate-900 truncate leading-none mb-1">
              {userDisplayName}
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <Shield size={10} className="text-amber-500" />
              {userRole}
            </div>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full mt-3 flex items-center justify-center gap-2 py-3 bg-white border border-rose-100 rounded-xl text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:border-rose-200 active:scale-95 transition-all shadow-sm"
        >
          <LogOut size={12} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
