import React from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { calculateOverallScore, scoreBg, scoreColor } from '@/utils/scores'
import { 
  Rocket, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Download, 
  Eye,
  FileText,
  Table
} from 'lucide-react'
import { cn } from '@/utils/cn'
import Link from 'next/link'

export default async function AllStartupsPage() {
  const supabase = await createServerSupabaseClient()
  
  // Fetch all startups (teams that have a startup_user_id)
  // Or actually all teams in general for now as requested
  const { data: teams, error } = await supabase
    .from('teams')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return <div>Error loading startups</div>

  return (
    <div className="p-10 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-600 shadow-xl shadow-indigo-100 rounded-2xl flex items-center justify-center text-white">
              <Rocket size={24} />
           </div>
           <div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Portfolio Engine</h1>
             <p className="text-slate-500 font-medium">Monitoring {teams?.length || 0} active diagnostic profiles</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
              <Download size={14} /> Export Global Excel
           </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center justify-between shadow-sm">
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter by startup name, sector, or stage..." 
              className="w-full pl-12 pr-6 py-2.5 bg-slate-50 border border-transparent rounded-2xl text-[13px] font-medium text-slate-900 outline-none focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 transition-all"
            />
         </div>
         <div className="flex items-center gap-2">
            <button className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 flex items-center gap-2">
               <Filter size={14} /> Advanced Filter
            </button>
            <div className="h-6 w-px bg-slate-200 mx-2" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Sorted By: Date Created</span>
         </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/20">
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
                <th className="p-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="p-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {teams?.map((team) => {
                const { overall, p1, p2, p3, p4, p5 } = calculateOverallScore(team)
                
                return (
                  <tr key={team.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{team.startupName || 'Untitled Startup'}</span>
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
                           {score.toFixed(1)}
                         </div>
                      </td>
                    ))}
                    <td className="p-6 text-center">
                       <span className={cn(
                         "text-sm font-black tabular-nums tracking-tighter",
                         overall >= 4 ? "text-emerald-600" : overall >= 3 ? "text-amber-500" : overall > 0 ? "text-rose-500" : "text-slate-300"
                       )}>
                         {overall.toFixed(1)}
                       </span>
                    </td>
                    <td className="p-6 text-center text-[10px]">
                       <div className={cn(
                         "inline-flex px-3 py-1 rounded-lg font-black uppercase tracking-widest border",
                         team.submission_status === 'draft' ? "bg-slate-50 text-slate-400 border-slate-100" : team.submission_status === 'submitted' ? "bg-amber-50 text-amber-600 border-amber-100" : team.submission_status === 'finalised' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                       )}>
                         {team.submission_status}
                       </div>
                    </td>
                    <td className="p-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/admin/startups/${team.id}`}
                            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50 transition-all"
                          >
                             <Eye size={16} />
                          </Link>
                          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all">
                             <FileText size={16} />
                          </button>
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
