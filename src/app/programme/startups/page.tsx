import React from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import Link from 'next/link'
import { Eye, ArrowUpRight, Search, Filter } from 'lucide-react'

export default async function ProgrammeStartupsPage() {
  const user = await getUserFromRequest()
  const supabase = await createServerSupabaseClient()
  
  const { data: teams } = await supabase
    .from('teams')
    .select('*')
    .is('deleted_at', null)
    .neq('submission_status', 'draft')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight mb-2">Startup Submissions</h1>
          <p className="text-slate font-bold uppercase text-[10px] tracking-widest opacity-60">Full Cohort Visibility</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-silver" size={16} />
             <input 
               type="text" 
               placeholder="Search startups..." 
               className="bg-white border border-rule pl-11 pr-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy focus:outline-none focus:ring-2 focus:ring-navy/5 w-64"
             />
           </div>
           <button className="flex items-center gap-2 bg-white border border-rule px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-navy hover:bg-smoke transition-all">
             <Filter size={14} /> Filter
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-rule shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-smoke/50 border-b border-rule font-bold text-[10px] uppercase tracking-widest text-silver">
              <th className="px-8 py-6">Startup</th>
              <th className="px-8 py-6">Sector</th>
              <th className="px-8 py-6">Sub #</th>
              <th className="px-8 py-6">Stage</th>
              <th className="px-8 py-6">Score</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule font-semibold">
            {teams?.map((team) => (
              <tr key={team.id} className="hover:bg-smoke/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-navy font-black text-sm">{team.startup_name || 'Unnamed Startup'}</span>
                    <span className="text-[9px] text-silver uppercase tracking-widest">{team.team_name}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-slate text-xs uppercase tracking-widest font-black">
                  {team.sector || 'N/A'}
                </td>
                <td className="px-8 py-6 text-navy font-black">
                  #{team.submission_number || 1}
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-smoke text-navy text-[9px] font-black uppercase tracking-tighter rounded-full border border-rule">
                    {team.detected_stage || 'Unknown'}
                  </span>
                </td>
                <td className="px-8 py-6 font-black text-navy">
                  {(team.overall_weighted_score || 0).toFixed(1)}
                </td>
                <td className="px-8 py-6 text-right">
                  <Link 
                    href={`/programme/startups/${team.id}`}
                    className="inline-flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-navy/90 transition-all shadow-lg shadow-navy/10"
                  >
                    View & Comment
                    <ArrowUpRight size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
