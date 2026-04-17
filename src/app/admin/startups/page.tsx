'use client'

import React, { useState, useEffect } from 'react'
import { calculateOverallScore, scoreBg, scoreColor } from '@/utils/scores'
import { 
  Rocket, 
  Search, 
  Filter, 
  Download, 
  Eye,
  FileText,
  Loader2,
  ShieldCheck
} from 'lucide-react'
import { cn } from '@/utils/cn'
import Link from 'next/link'
import { mapDbToFrontend } from '@/utils/mappers'

export default function AllStartupsPage() {
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/teams')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data.map(mapDbToFrontend).filter(t => t !== null)
          
          // Deduplicate: Keep only the latest submission per startupName
          const uniqueMap = new Map()
          
          // Sort teams so that 'submitted' or 'finalised' come after 'draft' for the same startup
          // This way, when we iterate, the better status wins in the map
          const sorted = [...mapped].sort((a: any, b: any) => {
             // Priority: finalised (2) > submitted (1) > draft (0)
             const getScore = (s: string) => s === 'finalised' ? 2 : s === 'submitted' ? 1 : 0
             return getScore(a.submission_status) - getScore(b.submission_status)
          })

          sorted.forEach((t: any) => {
            const key = t.startupName?.trim().toLowerCase() || t.id
            if (!uniqueMap.has(key)) {
              uniqueMap.set(key, t)
            } else {
              const existing = uniqueMap.get(key)
              // If status is better, or status is same but date is newer, replace
              const getScore = (s: string) => s === 'finalised' ? 2 : s === 'submitted' ? 1 : 0
              const currentScore = getScore(t.submission_status)
              const existingScore = getScore(existing.submission_status)
              
              if (currentScore > existingScore) {
                uniqueMap.set(key, t)
              } else if (currentScore === existingScore) {
                if (new Date(t.created_at) > new Date(existing.created_at)) {
                  uniqueMap.set(key, t)
                }
              }
            }
          })
          setTeams(Array.from(uniqueMap.values()))
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredTeams = teams.filter(t => 
    t.startupName?.toLowerCase().includes(search.toLowerCase()) || 
    t.sector?.toLowerCase().includes(search.toLowerCase()) ||
    t.detected_stage?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center gap-4 text-silver">
      <Loader2 className="animate-spin" size={32} />
      <span className="text-[10px] font-black uppercase tracking-widest">Hydrating Portfolio...</span>
    </div>
  )

  return (
    <div className="p-10 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-navy shadow-xl shadow-navy/10 rounded-2xl flex items-center justify-center text-gold">
              <Rocket size={24} />
           </div>
           <div>
             <h1 className="text-3xl font-black text-navy tracking-tight">Portfolio Engine</h1>
             <p className="text-slate-500 font-medium tracking-tight">Monitoring {filteredTeams.length} unique venture profiles</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
              <Download size={14} /> Export Dataset
           </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center justify-between shadow-sm">
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search ventures, sectors, or stages..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-2.5 bg-slate-50 border border-transparent rounded-2xl text-[13px] font-medium text-slate-900 outline-none focus:bg-white focus:border-navy/20 focus:ring-4 focus:ring-navy/5 transition-all"
            />
         </div>
         <div className="flex items-center gap-2">
            <button className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-navy flex items-center gap-2">
               <Filter size={14} /> Filters
            </button>
         </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-xl shadow-navy/5">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Startup Details</th>
                <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Stage</th>
                <th className="p-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">P1</th>
                <th className="p-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">P2</th>
                <th className="p-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">P3</th>
                <th className="p-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">P4</th>
                <th className="p-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">P5</th>
                <th className="p-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall</th>
                <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted At</th>
                <th className="p-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="p-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold">
              {filteredTeams.map((team) => {
                const { overall, p1, p2, p3, p4, p5 } = calculateOverallScore(team)
                
                return (
                  <tr key={team.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-navy group-hover:text-indigo-600 transition-colors">{team.startupName || 'Untitled Startup'}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{team.sector || 'Uncategorised'}</span>
                      </div>
                    </td>
                    <td className="p-6">
                       <span className={cn(
                         "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                         team.detected_stage?.includes('IDEA') ? "bg-slate-50 text-slate-500 border-slate-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                       )}>
                         {team.detected_stage?.split(' / ')[0] || 'IDEA'}
                       </span>
                    </td>
                    {[p1, p2, p3, p4, p5].map((score, idx) => (
                      <td key={idx} className="p-6 text-center">
                         <div 
                           className="w-8 h-8 rounded-lg mx-auto flex items-center justify-center text-[11px] font-black tabular-nums border"
                           style={{ backgroundColor: scoreBg(score), color: scoreColor(score), borderColor: scoreColor(score) + '20' }}
                         >
                           {(score || 0).toFixed(1)}
                         </div>
                      </td>
                    ))}
                    <td className="p-6 text-center">
                       <span className={cn(
                         "text-sm font-black tabular-nums tracking-tighter",
                         overall >= 4 ? "text-emerald-600" : overall >= 3 ? "text-amber-500" : overall > 0 ? "text-rose-500" : "text-slate-300"
                       )}>
                         {(overall || 0).toFixed(1)}
                       </span>
                    </td>
                    <td className="p-6 text-left">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-navy">{team.created_at ? new Date(team.created_at).toLocaleDateString() : 'N/A'}</span>
                          <span className="text-[9px] font-bold text-silver uppercase tracking-widest mt-0.5">{team.created_at ? new Date(team.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                       </div>
                    </td>
                    <td className="p-6 text-center text-[10px]">
                       <div className={cn(
                         "inline-flex px-3 py-1 rounded-lg font-black uppercase tracking-widest border",
                         team.submission_status === 'draft' ? "bg-slate-50 text-slate-400 border-slate-100" : team.submission_status === 'submitted' ? "bg-amber-50 text-amber-600 border-amber-100" : team.submission_status === 'finalised' ? "bg-teal-lt text-teal-brand border-teal-brand/10" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                       )}>
                         {team.submission_status}
                       </div>
                    </td>
                    <td className="p-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          {team.submission_status === 'submitted' && (
                             <button 
                               onClick={async () => {
                                 const res = await fetch('/api/admin/finalise', {
                                   method: 'POST',
                                   headers: { 'Content-Type': 'application/json' },
                                   body: JSON.stringify({ teamId: team.id, status: 'finalised' })
                                 })
                                 if (res.ok) {
                                   setTeams(prev => prev.map(t => t.id === team.id ? { ...t, submission_status: 'finalised' } : t))
                                 }
                               }}
                               title="Approve & Finalise"
                               className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"
                             >
                                <ShieldCheck size={16} />
                             </button>
                          )}
                          <Link 
                            href={`/admin/startups/${team.id}`}
                            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-navy hover:border-navy/20 hover:shadow-lg transition-all"
                          >
                             <Eye size={16} />
                          </Link>
                       </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
