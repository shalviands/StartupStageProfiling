'use client'

import React, { useState } from 'react'
import { Plus, Trash2, Search, Loader2 } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useTeams, useCreateTeam, useDeleteTeam } from '@/hooks/useTeams'
import { cn } from '@/utils/cn'

export default function Sidebar() {
  const { activeTeamId, setActiveTeamId } = useUIStore()
  const { data: teams = [], isLoading } = useTeams()
  const { mutate: createTeam, isPending: isCreating } = useCreateTeam()
  const { mutate: deleteTeam } = useDeleteTeam()
  const [search, setSearch] = useState('')

  const filteredTeams = teams.filter(t => 
    (t.startupName || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.teamName || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = () => {
    createTeam({ startupName: 'New Startup' }, {
      onSuccess: (newTeam) => {
        setActiveTeamId(newTeam.id)
      }
    })
  }

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation()
    if (confirm(`Delete ${name || 'this team'}?`)) {
      deleteTeam(id, {
        onSuccess: () => {
          if (activeTeamId === id) setActiveTeamId(null)
        }
      })
    }
  }

  return (
    <aside className="w-[260px] bg-white border-r border-rule flex flex-col h-full overflow-hidden shrink-0">
      {/* Search & Actions */}
      <div className="p-4 border-b border-rule space-y-3">
        <button 
          onClick={handleCreate}
          disabled={isCreating}
          className="w-full bg-gold hover:bg-gold/90 text-navy font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
        >
          {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          New Profile
        </button>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
          <input 
            type="text" 
            placeholder="Search teams..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-smoke border border-rule rounded-lg py-2 pl-9 pr-3 text-xs focus:ring-2 focus:ring-navy/10 focus:border-navy outline-none transition-all placeholder:text-silver"
          />
        </div>
      </div>

      {/* Team List */}
      <div className="flex-1 overflow-y-auto p-2 pb-20 space-y-1 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="animate-spin text-silver" size={20} />
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="p-8 text-center text-silver text-xs">
            {search ? 'No matches found.' : 'No team profiles yet.'}
          </div>
        ) : (
          filteredTeams.map(team => (
            <button
              key={team.id}
              onClick={() => setActiveTeamId(team.id)}
              className={cn(
                "w-full text-left p-3 rounded-xl transition-all group relative border border-transparent",
                activeTeamId === team.id 
                  ? "bg-navy text-white shadow-md shadow-navy/20 border-navy" 
                  : "hover:bg-smoke text-slate hover:border-rule"
              )}
            >
              <div className="font-bold text-xs truncate pr-6">
                {team.startupName || 'Untitled Startup'}
              </div>
              <div className={cn(
                "text-[10px] mt-0.5 truncate",
                activeTeamId === team.id ? "text-silver" : "text-silver"
              )}>
                {team.sector || 'Uncategorized'} · {team.institution || 'No Inst.'}
              </div>
              
              <div 
                onClick={(e) => handleDelete(e, team.id, team.startupName)}
                className={cn(
                  "absolute top-2.5 right-2.5 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100",
                  activeTeamId === team.id ? "hover:bg-white/10" : "hover:bg-white border border-rule shadow-sm"
                )}
              >
                <Trash2 size={12} className={activeTeamId === team.id ? "text-white" : "text-coral"} />
              </div>

              {activeTeamId === team.id && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gold rounded-r" />
              )}
            </button>
          ))
        )}
      </div>

      {/* Footer / Context */}
      <div className="p-4 border-t border-rule bg-smoke/50 mt-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-navy text-gold flex items-center justify-center font-bold text-[10px]">
            IU
          </div>
          <div className="text-[10px] text-slate leading-tight">
            <div className="font-bold">Incubation Centre</div>
            <div className="text-silver uppercase tracking-wider font-semibold mt-0.5">InUnity Hub</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
