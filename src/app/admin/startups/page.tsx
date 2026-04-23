import React from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { calculateOverallScore, scoreBg, scoreColor } from '@/utils/scores'
import { 
  Rocket, 
  Search, 
  Filter, 
  Download, 
  Eye,
  ShieldCheck,
  Building2,
  CalendarDays,
  FileDown,
  FileSpreadsheet
} from 'lucide-react'
import { cn } from '@/utils/cn'
import Link from 'next/link'
import { mapDbToFrontend } from '@/utils/mappers'

export default async function AllStartupsPage() {
  const supabase = await createServerSupabaseClient()
  
  // Fetch ALL non-deleted records
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="p-20 text-rose-500 font-bold">Error loading database: {error.message}</div>
  }

  const mapped = (data || []).map(mapDbToFrontend).filter(t => t !== null)

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
             <p className="text-slate-500 font-medium tracking-tight">Monitoring {mapped.length} venture profiles</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <a 
             href="/api/admin/export"
             className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
           >
              <Download size={14} /> Export Dataset
           </a>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-xl shadow-navy/5">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Startup Details</th>
                <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Stage / PSF</th>
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
            <tbody className="divide-y divide-slate-50 font-semibold text-sm">
              {mapped.map((team: any) => {
                const { overall, averages } = calculateOverallScore(team)
                const { p1, p2, p3, p4, p5 } = averages

                return (
                  <tr key={team.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-navy group-hover:text-gold transition-all">
                          <Building2 size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-navy group-hover:text-indigo-600 transition-colors">{team.startupName || 'Untitled Startup'}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{team.sector || 'Uncategorised'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                       <div className="flex flex-col gap-1">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border w-fit",
                            team.detected_stage?.includes('IDEA') ? "bg-slate-50 text-slate-500 border-slate-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                          )}>
                            {team.detected_stage?.split(' / ')[0] || 'IDEA'}
                          </span>
                       </div>
                    </td>
                    {[p1, p2, p3, p4, p5].map((score, idx) => (
                      <td key={idx} className="p-6 text-center">
                         <div 
                           className="w-8 h-8 rounded-lg mx-auto flex items-center justify-center text-[11px] font-black tabular-nums border shadow-sm"
                           style={{ backgroundColor: scoreBg(score), color: scoreColor(score), border: 'none' }}
                         >
                           {(score || 0).toFixed(1)}
                         </div>
                      </td>
                    ))}
                    <td className="p-6 text-center">
                       <span className={cn(
                         "text-base font-black tabular-nums tracking-tighter hover:scale-110 transition-transform block",
                         overall >= 4 ? "text-teal" : overall >= 3 ? "text-gold" : overall > 0 ? "text-coral" : "text-slate-300"
                       )}>
                         {(overall || 0).toFixed(1)}
                       </span>
                    </td>
                    <td className="p-6 text-center">
                        <div className={cn(
                          "px-3 py-1.5 rounded-xl font-black uppercase tracking-widest border text-[9px] w-fit mx-auto",
                          team.diagnosis_released ? "bg-teal-50 text-teal-600 border-teal-100" : team.submission_status === 'draft' ? "bg-slate-50 text-slate-400 border-slate-100" : "bg-amber-50 text-amber-600 border-amber-100"
                        )}>
                          {team.diagnosis_released ? 'RELEASED' : team.submission_status}
                        </div>
                    </td>
                    <td className="p-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/startups/${team.id}`}
                            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-navy hover:border-navy/20 hover:shadow-xl transition-all"
                            title="View Profile"
                          >
                             <Eye size={18} />
                          </Link>
                          <a
                            href={`/api/teams/${team.id}/pdf`}
                            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:shadow-xl transition-all"
                            title="Download PDF"
                          >
                             <FileDown size={18} />
                          </a>
                          <a
                            href={`/api/teams/${team.id}/excel`}
                            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-500 hover:border-emerald-200 hover:shadow-xl transition-all"
                            title="Download Excel"
                          >
                             <FileSpreadsheet size={18} />
                          </a>
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
