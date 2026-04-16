import React, { useState } from 'react'
import type { TeamProfile } from '@/types/team.types'
import { calculateScores, scoreBg, scoreColor, scoreLabel } from '@/utils/scores'
import ExcelDownloadButton from '@/components/excel/ExcelDownloadButton'
import { FileText, Loader2 } from 'lucide-react'

export default function LivePreview({ team }: { team: TeamProfile }) {
  const scores = calculateScores(team)
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)

  const handlePDFDownload = async () => {
    try {
      setIsDownloadingPDF(true)
      const res = await fetch(`/api/teams/${team.id}/pdf`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to generate PDF')
      
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${team.startupName || 'Startup'}-Diagnosis-Brief.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (err) {
      console.error(err)
      alert('Failed to download PDF')
    } finally {
      setIsDownloadingPDF(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white border-b border-rule space-y-6 scrollbar-hide">
      <div className="space-y-1">
        <h3 className="text-[10px] font-black text-silver uppercase tracking-[0.2em]">Diagnostic Overview</h3>
        <h2 className="text-sm font-black text-navy truncate">{team.startupName || 'Draft Profile'}</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Problem', score: scores.problem },
          { label: 'Market', score: scores.market },
          { label: 'Business', score: scores.biz },
          { label: 'Pitch', score: scores.pitch },
        ].map((s) => (
          <div key={s.label} className="p-3 rounded-2xl border border-rule shadow-sm space-y-2 bg-smoke/30">
            <div className="text-[9px] font-bold text-silver uppercase tracking-wider">{s.label}</div>
            <div className="flex items-end gap-1">
              <span className="text-xl font-black text-navy leading-none">{s.score || '-'}</span>
              <span className="text-[9px] font-bold text-silver mb-0.5">/ 5</span>
            </div>
            <div 
              className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full w-fit"
              style={{ backgroundColor: scoreBg(s.score), color: scoreColor(s.score) }}
            >
              {scoreLabel(s.score)}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-navy p-4 rounded-2xl text-white space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gold/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="flex justify-between items-center relative z-10">
          <div className="text-[9px] font-bold text-gold uppercase tracking-widest">Aggregate Score</div>
          <div className="text-2xl font-black">{scores.overall || '0.0'}</div>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden relative z-10">
          <div 
            className="h-full bg-gold transition-all duration-700 ease-out"
            style={{ width: `${(scores.overall || 0) * 20}%` }}
          />
        </div>
      </div>
      
      {/* Export Actions */}
      <div className="pt-2 flex flex-col gap-2">
         <div className="text-[10px] font-bold text-silver uppercase tracking-wider px-1">Exports</div>
         <div className="flex gap-2">
            <ExcelDownloadButton team={team} />
            <button
               onClick={handlePDFDownload}
               disabled={isDownloadingPDF}
               className="flex-1 bg-navy text-white hover:bg-navy/90 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
               {isDownloadingPDF ? (
                  <Loader2 size={14} className="animate-spin" />
               ) : (
                  <FileText size={14} />
               )}
               PDF Brief
            </button>
         </div>
      </div>
      
      {/* Complete/Incomplete Indicators */}
      <div className="space-y-2 pt-2">
         <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-silver uppercase">Profile Status</span>
            <span className={cn(
               "text-[10px] font-black uppercase tracking-tighter",
               scores.overall ? "text-teal" : "text-coral"
            )}>
               {scores.overall ? 'Active Data' : 'Initial Draft'}
            </span>
         </div>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
