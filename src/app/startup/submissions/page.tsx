'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useTeams } from '@/hooks/useTeams'
import { Loader2, Plus, Eye, Calendar, BarChart3, Rocket } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/utils/cn'

export default function SubmissionsPage() {
  const router = useRouter()
  const { data: teams = [], isLoading } = useTeams()
  
  // Filter for only submitted ones (optional, but requested view shows past submissions)
  const submissions = teams.filter(t => t.submission_status === 'submitted')

  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-silver">
      <Loader2 className="animate-spin" size={32} />
      <span className="text-[10px] font-black uppercase tracking-widest tracking-[0.3em]">Loading Submissions...</span>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight mb-2">My Submissions</h1>
          <p className="text-slate font-bold uppercase text-[10px] tracking-widest opacity-60">History of Strategic Assessments</p>
        </div>
        <Link 
          href="/startup/profiler"
          className="flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-navy/20"
        >
          <Plus size={16} />
          New Profile
        </Link>
      </div>

      <div className="bg-white rounded-[40px] border border-rule shadow-xl shadow-navy/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-smoke/50 border-b border-rule font-bold text-[10px] uppercase tracking-widest text-silver">
              <th className="px-8 py-6">Submission #</th>
              <th className="px-8 py-6">Date Submitted</th>
              <th className="px-8 py-6">Overall Score</th>
              <th className="px-8 py-6">Stage Detected</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule font-semibold">
            {submissions.map((sub) => (
              <tr key={sub.id} className="hover:bg-smoke/30 transition-colors group">
                <td className="px-8 py-6 text-navy font-black">
                  #{sub.submission_number || 1}
                </td>
                <td className="px-8 py-6 text-slate text-xs flex items-center gap-2">
                  <Calendar size={14} className="text-silver" />
                  {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={14} className="text-silver" />
                    <span className="text-navy">{(sub.overall_weighted_score || 0).toFixed(1)}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <Rocket size={14} className="text-silver" />
                    <span className="text-navy">{sub.detected_stage || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-tighter rounded-full border border-emerald-100">
                    SUBMITTED
                   </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <Link 
                    href={`/startup/submissions/${sub.id}`}
                    className="inline-flex items-center gap-2 bg-smoke text-navy px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-navy hover:text-white transition-all shadow-sm"
                  >
                    <Eye size={12} />
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center">
                  <div className="max-w-xs mx-auto space-y-4">
                    <div className="w-16 h-16 bg-smoke rounded-full flex items-center justify-center mx-auto text-silver">
                       <BarChart3 size={32} />
                    </div>
                    <div>
                      <h3 className="text-navy font-black text-sm">No submissions yet</h3>
                      <p className="text-xs text-slate font-medium">Start your first strategic profiling session to see results here.</p>
                    </div>
                    <Link 
                      href="/startup/profiler"
                      className="inline-block bg-navy text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      Start Profiler
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
