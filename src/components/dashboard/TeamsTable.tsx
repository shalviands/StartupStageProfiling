'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import type { TeamProfile } from '@/types/team.types'
import { cn } from '@/utils/cn'
import { Search, Filter, ArrowUpRight, SearchX } from 'lucide-react'
import { scoreColor, scoreBg } from '@/utils/scores'
import { useUIStore } from '@/store/uiStore'

interface Props {
  teams: TeamProfile[]
  isLoading?: boolean
}

export default function TeamsTable({ teams, isLoading }: Props) {
  const { setActiveTeamId, setSection } = useUIStore()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = React.useState('')

  const handleRowClick = (id: string) => {
    setActiveTeamId(id)
    setSection(0)
    router.push('/profiler')
  }

  const filtered = teams.filter(t => 
    t.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.sector.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) return (
    <div className="bg-white border border-rule rounded-[32px] p-20 flex flex-col items-center justify-center gap-4 text-silver">
      <div className="w-10 h-10 border-4 border-smoke border-t-navy rounded-full animate-spin" />
      <span className="text-[10px] font-black uppercase tracking-widest leading-none">Cataloging Ventures...</span>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-silver group-focus-within:text-navy transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by startup name or sector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-rule rounded-2xl pl-12 pr-4 py-3.5 text-sm text-navy outline-none focus:border-navy focus:ring-4 focus:ring-navy/5 transition-all shadow-sm placeholder:text-silver/50 font-medium"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3.5 bg-smoke border border-rule rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy hover:bg-rule transition-all transition-transform active:scale-95 shadow-sm">
          <Filter size={14} /> Filter Analytics
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-rule rounded-[32px] overflow-hidden shadow-sm shadow-navy/5 relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-smoke/50 border-b border-rule">
                <th className="px-8 py-5 text-[10px] font-black text-silver uppercase tracking-[0.2em]">Venture Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-silver uppercase tracking-[0.2em]">Diagnostic Phase</th>
                <th className="px-8 py-5 text-[10px] font-black text-silver uppercase tracking-[0.2em]">Baseline Score</th>
                <th className="px-8 py-5 text-[10px] font-black text-silver uppercase tracking-[0.2em]">Submission</th>
                <th className="px-8 py-5 text-[10px] font-black text-silver uppercase tracking-[0.2em] text-right">Metrics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule/50">
              {filtered.length > 0 ? filtered.map((team) => (
                <tr 
                  key={team.id}
                  onClick={() => handleRowClick(team.id)}
                  className="hover:bg-smoke/30 transition-colors cursor-pointer group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-navy/5 border border-navy/5 flex items-center justify-center font-bold text-navy text-xs">
                        {team.startupName.slice(0, 1) || 'V'}
                      </div>
                      <div>
                        <div className="font-black text-navy text-sm tracking-tight group-hover:text-gold transition-colors">{team.startupName || 'Unnamed Venture'}</div>
                        <div className="text-[10px] text-silver font-bold uppercase tracking-wider">{team.sector || 'Uncategorized'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className="text-[10px] font-black text-navy uppercase tracking-widest bg-smoke px-3 py-1.5 rounded-full border border-rule">
                        {team.detected_stage || 'Ideation'}
                     </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm tabular-nums shadow-sm"
                        style={{ background: scoreBg(team.overall_weighted_score), color: scoreColor(team.overall_weighted_score) }}
                      >
                        {team.overall_weighted_score?.toFixed(1) || '--'}
                      </div>
                      <div className="w-24 h-1.5 bg-smoke rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${(team.overall_weighted_score || 0) * 20}%`,
                            backgroundColor: scoreColor(team.overall_weighted_score)
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border",
                      team.submission_status === 'submitted' 
                        ? "bg-teal-lt border-teal/20 text-teal" 
                        : "bg-gold-lt border-gold/20 text-gold"
                    )}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", team.submission_status === 'submitted' ? "bg-teal" : "bg-gold animate-pulse")} />
                      {team.submission_status}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-silver group-hover:text-navy transition-colors">
                      <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-silver">
                       <div className="w-16 h-16 rounded-full bg-smoke flex items-center justify-center">
                          <SearchX size={32} strokeWidth={1.5} />
                       </div>
                       <div>
                         <p className="text-sm font-black text-navy mb-1 uppercase tracking-widest">No matching ventures</p>
                         <p className="text-[11px] font-bold text-silver uppercase tracking-wider">Try adjusting your search criteria</p>
                       </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
