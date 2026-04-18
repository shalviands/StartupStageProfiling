'use client'

import React, { useState } from 'react'
import { TeamProfile, SubmissionComment } from '@/types/team.types'
import SubmissionView from '@/components/startup/SubmissionView'
import CommentPanel from './CommentPanel'
import { BarChart3, Rocket, Target, Zap, Loader2, CheckCircle2, Sparkles, FileDown, FileSpreadsheet } from 'lucide-react'
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
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleDownload = async (type: 'pdf' | 'excel') => {
    try {
      setDownloading(type)
      const res = await fetch(`/api/teams/${team.id}/${type}`)
      if (!res.ok) throw new Error(`Failed to download ${type}`)
      
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${team.startupName || 'Startup'}_${type === 'pdf' ? 'Report' : 'Analysis'}.${type === 'pdf' ? 'pdf' : 'xlsx'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error(`[Download] ${type} failed:`, err)
      alert(`Failed to generate ${type}. Please try again.`)
    } finally {
      setDownloading(null)
    }
  }

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
                    const nextState = !team.diagnosis_released
                    try {
                      setRunningAI(true)
                      const res = await fetch('/api/programme/release-diagnosis', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ teamId: team.id, release: nextState })
                      })
                      if (!res.ok) throw new Error('Failed to update release state')
                      window.location.reload()
                    } catch (err) {
                      console.error('[Evaluation] Release failed:', err)
                    } finally {
                      setRunningAI(false)
                    }
                  }}
                  disabled={runningAI}
                  className={cn(
                    "flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl disabled:opacity-50",
                    team.diagnosis_released
                      ? "bg-teal text-white shadow-teal/20"
                      : "bg-gold text-navy shadow-gold/20 hover:scale-[1.02] active:scale-95"
                  )}
                >
                  {runningAI ? <Loader2 size={16} className="animate-spin" /> : team.diagnosis_released ? <CheckCircle2 size={16} /> : <Zap size={16} />}
                  {team.diagnosis_released ? 'Diagnosis Released' : 'Release Diagnosis to Startup'}
                </button>

                <button 
                  onClick={handleRunAI}
                  disabled={runningAI}
                  className="flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-navy/20 disabled:opacity-50"
                >
                  {runningAI ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="text-gold" />}
                  Run AI Assessment
                </button>

                <div className="flex rounded-2xl overflow-hidden shadow-sm border border-rule">
                  <button 
                    onClick={() => handleDownload('pdf')}
                    disabled={!!downloading}
                    className="flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-navy bg-smoke hover:bg-slate/10 transition-all border-r border-rule disabled:opacity-50"
                  >
                    {downloading === 'pdf' ? <Loader2 size={14} className="animate-spin text-silver" /> : <FileDown size={14} className="text-silver" />}
                    PDF
                  </button>
                  <button 
                    onClick={() => handleDownload('excel')}
                    disabled={!!downloading}
                    className="flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-navy bg-smoke hover:bg-slate/10 transition-all disabled:opacity-50"
                  >
                    {downloading === 'excel' ? <Loader2 size={14} className="animate-spin text-silver" /> : <FileSpreadsheet size={14} className="text-silver" />}
                    Excel
                  </button>
                </div>
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
