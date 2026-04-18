import React from 'react'
import Link from 'next/link'
import { Eye, ArrowUpRight } from 'lucide-react'
import { TeamProfile } from '@/types/team.types'

export default function RecentSubmissionsTable({ teams }: { teams: TeamProfile[] }) {
  if (!teams || teams.length === 0) return (
    <div className="py-20 text-center text-silver text-[10px] font-black uppercase tracking-widest opacity-40">
      No recent activity
    </div>
  )

  return (
    <div className="overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-rule font-bold text-[9px] uppercase tracking-widest text-silver">
            <th className="pb-4">Startup</th>
            <th className="pb-4">Stage</th>
            <th className="pb-4">Score</th>
            <th className="pb-4">Submitted At</th>
            <th className="pb-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rule font-semibold">
          {teams.map((team) => (
            <tr key={team.id} className="hover:bg-smoke/30 transition-colors group">
              <td className="py-4">
                <div className="flex flex-col">
                  <span className="text-navy font-black text-xs">
                    {team.startupName || (team as any).startup_name || 'Unnamed'}
                  </span>
                  <span className="text-[8px] text-silver uppercase tracking-widest">
                    {team.sector || (team as any).sector}
                  </span>
                </div>
              </td>
              <td className="py-4">
                <span className="px-2 py-0.5 bg-smoke text-navy text-[8px] font-black uppercase rounded border border-rule">
                  {team.detected_stage || 'N/A'}
                </span>
              </td>
              <td className="py-4 font-black text-navy text-xs">
                {(team.overall_weighted_score || 0).toFixed(1)}
              </td>
              <td className="py-4">
                <div className="flex flex-col">
                  <span className="text-navy font-black text-[10px]">
                    {team.created_at ? new Date(team.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                  <span className="text-[9px] text-silver font-bold opacity-60">
                    {team.created_at ? new Date(team.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              </td>
              <td className="py-4 text-right">
                <Link 
                  href={`/programme/startups/${team.id}`}
                  className="inline-flex items-center gap-1 text-navy hover:text-coral transition-all text-[9px] font-black uppercase tracking-widest"
                >
                  View <ArrowUpRight size={10} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
