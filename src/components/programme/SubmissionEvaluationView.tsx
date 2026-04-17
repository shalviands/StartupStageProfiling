'use client'

import React, { useState } from 'react'
import { TeamProfile, SubmissionComment } from '@/types/team.types'
import SubmissionView from '@/components/startup/SubmissionView'
import CommentPanel from './CommentPanel'
import { BarChart3, Rocket, Target, Zap, Loader2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SubmissionEvaluationViewProps {
  team: TeamProfile
  initialComments: SubmissionComment[]
  currentUserRole: string
}

export default function SubmissionEvaluationView({ 
  team, 
  initialComments, 
  currentUserRole 
}: SubmissionEvaluationViewProps) {
  const [runningAI, setRunningAI] = useState(false)

  const handleRunAI = async () => {
    setRunningAI(true)
    // AI call logic here
    setTimeout(() => {
      setRunningAI(false)
      alert('AI Analysis requested. Results will appear in the Roadmap/Analysis sections.')
    }, 2000)
  }

  return (
    <div className="flex h-full bg-[#F4F6F9]">
      {/* Left Panel - Read-only Submission (70%) */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-5xl mx-auto">
          {/* Stage Banner & AI Action */}
          <div className="bg-white rounded-[40px] border border-rule p-10 mb-10 shadow-xl shadow-navy/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-navy/5 -mr-32 -mt-32 rounded-full blur-3xl opacity-50" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-3xl bg-navy text-gold flex items-center justify-center shadow-lg shadow-navy/20">
                  <Rocket size={32} />
                </div>
                <div>
                  <h2 className="text-[10px] font-black text-silver uppercase tracking-[0.3em] mb-1">Detected Startup Stage</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-navy tracking-tight">{team.detected_stage || 'Unknown Stage'}</span>
                    <div className="px-3 py-1 bg-gold-lt text-gold text-[10px] font-black rounded-lg border border-gold/10">
                      PSF Score: {(team.overall_weighted_score || 0).toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={async () => {
                    const nextStatus = team.submission_status === 'finalised' ? 'submitted' : 'finalised'
                    try {
                      setRunningAI(true)
                      const res = await fetch('/api/admin/finalise', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ teamId: team.id, status: nextStatus })
                      })
                      if (!res.ok) throw new Error('Failed to update status')
                      window.location.reload() // Quick refresh to update state
                    } catch (err) {
                      console.error('[Evaluation] Finalise failed:', err)
                    } finally {
                      setRunningAI(false)
                    }
                  }}
                  disabled={runningAI}
                  className={cn(
                    "flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl disabled:opacity-50",
                    team.submission_status === 'finalised'
                      ? "bg-emerald-600 text-white shadow-emerald-200"
                      : "bg-gold text-navy shadow-gold/20 hover:scale-[1.02] active:scale-95"
                  )}
                >
                  {runningAI ? <Loader2 size={16} className="animate-spin" /> : team.submission_status === 'finalised' ? <CheckCircle2 size={16} /> : <Target size={16} />}
                  {team.submission_status === 'finalised' ? 'Approved & Finalised' : 'Approve & Finalise'}
                </button>

                <button 
                  onClick={handleRunAI}
                  disabled={runningAI}
                  className="flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-navy/20 disabled:opacity-50"
                >
                  {runningAI ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} className="text-gold" />}
                  Run AI Analysis
                </button>
              </div>
            </div>
          </div>

          <SubmissionView submission={team} />
        </div>
      </div>

      {/* Right Panel - Evaluator Comments (30%) */}
      <div className="w-[400px] shrink-0">
        <CommentPanel 
          teamId={team.id} 
          initialComments={initialComments} 
          currentUserRole={currentUserRole} 
        />
      </div>
    </div>
  )
}
