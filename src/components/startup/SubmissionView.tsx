'use client'

import React from 'react'
import { PARAMETERS_CONFIG } from '@/config/parameters'
import { TeamProfile } from '@/types/team.types'
import { calculateOverallScore, getRoadmap } from '@/utils/scores'
import { cn } from '@/utils/cn'
import { ChevronRight, BarChart3, CheckSquare, Info } from 'lucide-react'
import PDFDownloadButton from '@/components/pdf/PDFDownloadButton'

interface SubmissionViewProps {
  submission: TeamProfile
}

export default function SubmissionView({ submission }: SubmissionViewProps) {
  const { averages } = calculateOverallScore(submission)
  const roadmap = getRoadmap(submission)

  return (
    <div className="space-y-12">
      {/* Header Summary */}
      <div className="bg-white rounded-[40px] border border-rule p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-navy/5">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-3xl font-black text-navy tracking-tight">{submission.startupName || 'Startup Submission'}</h2>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <span className="px-3 py-1 bg-smoke text-navy text-[9px] font-black uppercase tracking-tighter rounded-full border border-rule">
              {submission.detected_stage || 'N/A Stage'}
            </span>
            <span className="text-silver text-[10px] font-bold uppercase tracking-widest">
              Submitted: {submission.created_at ? new Date(submission.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center bg-smoke px-6 py-4 rounded-3xl border border-rule">
            <span className="block text-[10px] font-black text-silver uppercase tracking-widest mb-1">Overall Score</span>
            <span className="text-4xl font-black text-navy">{(submission.overall_weighted_score || 0).toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {PARAMETERS_CONFIG.map((param, index) => {
          const paramId = param.id as keyof typeof submission | string
          // We need to map the fields properly. 
          // For simplicity, we just iterate coreQs and deepDiveQs
          
          return (
            <div key={param.id} className="bg-white rounded-[40px] border border-rule overflow-hidden shadow-sm">
              <div className="bg-smoke/30 px-10 py-8 border-b border-rule flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-navy flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-navy text-gold flex items-center justify-center text-xs">P{index + 1}</span>
                    {param.title}
                  </h3>
                  <p className="text-xs text-slate font-medium mt-1">{param.subtitle}</p>
                </div>
                <div className="flex gap-6 text-right">
                   <div>
                     <div className="text-[10px] font-black text-silver uppercase tracking-widest mb-1">Score</div>
                     <div className="text-lg font-black text-gold">
                       {((averages as any)[param.id.toLowerCase()] || 0).toFixed(1)} <span className="text-[10px] text-silver">/ 5</span>
                     </div>
                   </div>
                   <div>
                     <div className="text-[10px] font-black text-silver uppercase tracking-widest mb-1">Weight</div>
                     <div className="text-lg font-black text-navy">{param.weight}</div>
                   </div>
                </div>
              </div>

              <div className="p-10 space-y-8">
                {/* Score if available */}
                {/* Note: Individual parameter average scores aren't explicitly saved, 
                    but we display the answers provided. */}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {[...param.coreQs, ...param.deepDiveQs].map((q) => {
                    const value = (submission as any)[`${param.id}_${q.id}`]
                    const score = (submission as any)[`${param.id}_${q.id}_score`]

                    return (
                      <div key={q.id} className="space-y-2">
                        <label className="text-[10px] font-black text-silver uppercase tracking-widest flex items-center gap-2">
                          <CheckSquare size={12} className="text-teal" />
                          {q.label}
                        </label>
                        <div className="bg-smoke/50 p-4 rounded-2xl border border-rule/50">
                           <p className="text-sm font-semibold text-navy leading-relaxed italic">
                             {value || <span className="text-silver italic opacity-50">No answer provided</span>}
                           </p>
                        </div>
                        {score !== undefined && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <div 
                                  key={s} 
                                  className={cn(
                                    "w-2 h-2 rounded-full",
                                    s <= score ? "bg-navy" : "bg-smoke border border-rule"
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-[9px] font-bold text-silver uppercase tracking-widest">Score: {score}/5</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Observation / Evaluator Notes if any */}
                {(submission as any)[`${param.id}_observation`] && (
                  <div className="mt-8 pt-8 border-t border-rule">
                    <div className="flex items-start gap-4 p-6 bg-gold-lt/30 rounded-3xl border border-gold/10">
                      <div className="w-10 h-10 rounded-2xl bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
                        <Info size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[10px] font-black text-gold uppercase tracking-widest">Strategic Observation</h4>
                        <p className="text-sm font-medium text-slate leading-relaxed">
                          {(submission as any)[`${param.id}_observation`]}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {roadmap.length > 0 && (
        <div className="bg-white rounded-[40px] border border-rule overflow-hidden shadow-sm p-10 space-y-8">
          <div>
            <h3 className="text-xl font-black text-navy">Strategic Roadmap (Next 30 Days)</h3>
            <p className="text-xs text-slate font-medium mt-1">Recommended actions derived from diagnostic scoring</p>
          </div>
          <div className="space-y-4">
            {roadmap.slice(0, 5).map((r, i) => (
              <div key={i} className="flex gap-6 items-start p-4 bg-smoke/30 rounded-2xl border border-rule/50">
                 <div className="px-3 py-1 bg-gold/10 text-gold text-[10px] font-black uppercase tracking-widest rounded-lg shrink-0 w-24 text-center">
                   {r.priority}
                 </div>
                 <div className="flex-1">
                   <p className="text-sm font-semibold text-navy">{r.action}</p>
                 </div>
                 <div className="text-[10px] font-bold text-silver uppercase tracking-widest shrink-0">
                   {r.byWhen}
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {submission.diagnosis_released ? (
        <div className="flex justify-center">
          <PDFDownloadButton team={submission} />
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="px-6 py-4 bg-smoke rounded-2xl border border-rule text-center">
            <p className="text-[10px] font-black text-silver uppercase tracking-widest">Diagnosis Under Review</p>
            <p className="text-xs text-slate font-medium mt-1">Your report will be available here once the programme team completes the evaluation.</p>
          </div>
        </div>
      )}
    </div>
  )
}
