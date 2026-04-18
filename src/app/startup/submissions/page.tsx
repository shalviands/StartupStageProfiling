'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useTeams } from '@/hooks/useTeams'
import { Loader2, Plus, Eye, Calendar, BarChart3, Rocket, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/utils/cn'
import { useDeleteTeam } from '@/hooks/useTeams'
import PDFDownloadButton from '@/components/pdf/PDFDownloadButton'

export default function SubmissionsPage() {
  const router = useRouter()
  const { data: teams = [], isLoading } = useTeams()
  const deleteTeam = useDeleteTeam()
  
  // Show all teams for the startup
  const submissions = teams

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this profiling session? This action cannot be undone.')) return
    try {
      await deleteTeam.mutateAsync(id)
    } catch (err) {
      alert('Failed to delete session.')
    }
  }

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
              <th className="px-8 py-6 text-[10px]">Sub # / Identity</th>
              <th className="px-8 py-6 text-[10px]">Timestamp</th>
              <th className="px-8 py-6 text-[10px]">Submitted By</th>
              <th className="px-8 py-6 text-[10px]">Overall Score</th>
              <th className="px-8 py-6 text-[10px]">Status</th>
              <th className="px-8 py-6 text-right text-[10px]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule font-semibold">
            {submissions.map((sub: any) => (
              <tr key={sub.id} className="hover:bg-smoke/30 transition-colors group">
                <td className="px-8 py-6">
                   <div className="flex flex-col">
                      <span className="text-navy font-black">
                        #{sub.startup_user_id?.slice(0, 4).toUpperCase()}-{sub.submission_number || 1}
                      </span>
                      <span className="text-[10px] text-slate font-bold uppercase tracking-widest mt-1">
                        {sub.startupName || 'Venture Profile'}
                      </span>
                   </div>
                </td>
                <td className="py-6 px-4">
                  <div className="flex flex-col">
                     <span>{sub.created_at ? new Date(sub.created_at).toLocaleDateString() : 'N/A'}</span>
                     <span className="text-[9px] opacity-40 font-bold">{sub.created_at ? new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex flex-col">
                      <span className="text-navy text-xs">{sub.submitter?.full_name || 'Account Owner'}</span>
                      {sub.interviewer && sub.interviewer !== sub.submitter?.full_name && (
                        <span className="text-[9px] text-silver font-bold uppercase mt-0.5">Ref: {sub.interviewer}</span>
                      )}
                   </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={14} className="text-silver" />
                    <span className="text-navy">{(sub.overall_weighted_score || 0).toFixed(1)}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex flex-col gap-1">
                      {sub.deleted_at ? (
                        <span className="px-3 py-1 bg-coral-lt text-coral text-[8px] font-black uppercase tracking-tighter rounded-full border border-coral/10">
                          ARCHIVED
                        </span>
                      ) : sub.submission_status === 'draft' ? (
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[8px] font-black uppercase tracking-tighter rounded-full border border-slate-200">
                          DRAFT MODE
                        </span>
                      ) : !sub.diagnosis_released ? (
                        <span className="px-3 py-1 bg-gold-lt text-gold text-[8px] font-black uppercase tracking-tighter rounded-full border border-gold/10">
                          SUBMITTED
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-teal-lt text-teal text-[8px] font-black uppercase tracking-tighter rounded-full border border-teal/10">
                          APPROVED
                        </span>
                      )}
                   </div>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex items-center justify-end gap-3">
                      {sub.diagnosis_released ? (
                        <PDFDownloadButton team={sub} />
                      ) : (
                        <Link 
                          href={sub.submission_status === 'draft' ? '/startup/profiler' : `/startup/submissions/${sub.id}`}
                          className="inline-flex items-center gap-2 bg-white border border-rule text-navy px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-navy hover:text-white transition-all shadow-sm"
                        >
                          <Eye size={12} />
                          {sub.submission_status === 'draft' ? 'Continue Editing' : 'View'}
                        </Link>
                      )}
                      
                      {sub.submission_status === 'draft' && (
                        <button 
                          onClick={() => handleDelete(sub.id)}
                          className="p-2.5 text-silver hover:text-coral hover:bg-coral-lt rounded-xl transition-all"
                          title="Delete Session"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                   </div>
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
