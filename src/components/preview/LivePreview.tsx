import React, { useState } from 'react'
import type { TeamProfile } from '@/types/team.types'
import { calculateOverallScore, scoreBg, scoreColor, scoreLabel } from '@/utils/scores'
import ExcelDownloadButton from '@/components/excel/ExcelDownloadButton'
import { FileText, Loader2, Target, Zap, ShieldCheck, TrendingUp } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function LivePreview({ team }: { team: TeamProfile }) {
  const { overall, p1, p2, p3, p4, p5, p6, p7, p8, p9 } = calculateOverallScore(team)
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
      a.download = `${team.startupName || 'Startup'}-Diagnosis-Report.pdf`
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

  const pStats = [
    { id: 'P1', val: p1 }, { id: 'P2', val: p2 }, { id: 'P3', val: p3 },
    { id: 'P4', val: p4 }, { id: 'P5', val: p5 }, { id: 'P6', val: p6 },
    { id: 'P7', val: p7 }, { id: 'P8', val: p8 }, { id: 'P9', val: p9 },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white space-y-8 scrollbar-hide">
      <div className="space-y-1">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Diagnostic Summary</h3>
        <h2 className="text-lg font-black text-slate-900 truncate leading-tight">{team.startupName || 'Draft Profile'}</h2>
      </div>

      {/* Hero Score */}
      <div className="bg-slate-900 p-6 rounded-[32px] text-white space-y-4 relative overflow-hidden shadow-xl shadow-slate-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="flex justify-between items-center relative z-10">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Weighted Global</span>
            <span className="text-2xl font-black">{overall.toFixed(1)}</span>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
            <Target size={20} />
          </div>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden relative z-10">
          <div 
            className="h-full bg-white transition-all duration-1000 ease-out"
            style={{ width: `${(overall / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* P1-P9 Grid */}
      <div className="space-y-3">
        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Parameters (P1-P9)</div>
        <div className="grid grid-cols-3 gap-2">
          {pStats.map((s) => (
            <div key={s.id} className="p-3 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col items-center gap-1 group">
               <span className="text-[9px] font-bold text-slate-400">{s.id}</span>
               <span className={cn(
                 "text-sm font-black transition-colors",
                 s.val >= 4 ? "text-emerald-600" : s.val >= 3 ? "text-amber-500" : s.val > 0 ? "text-rose-500" : "text-slate-200"
               )}>
                 {s.val > 0 ? s.val.toFixed(1) : '--'}
               </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Export Actions */}
      <div className="space-y-3">
         <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-1">Professional Exports</div>
         <div className="flex flex-col gap-2">
            <ExcelDownloadButton team={team} />
            <button
               onClick={handlePDFDownload}
               disabled={isDownloadingPDF}
               className="w-full bg-slate-900 text-white hover:bg-slate-800 px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-slate-100"
            >
               {isDownloadingPDF ? (
                  <Loader2 size={16} className="animate-spin text-white/50" />
               ) : (
                  <FileText size={16} />
               )}
               Generate PDF Report
            </button>
         </div>
      </div>
      
      {/* Mentor Type */}
      <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-3xl space-y-2">
         <div className="flex items-center gap-2 text-indigo-900">
            <Zap size={14} className="text-indigo-600" />
            <span className="text-[9px] font-black uppercase tracking-wider">Assigned Mentor</span>
         </div>
         <p className="text-xs font-bold text-slate-700">{team.assigned_mentor_type || 'Discovery Coach'}</p>
      </div>
    </div>
  )
}
