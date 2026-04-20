import React, { useState } from 'react'
import type { TeamProfile } from '@/types/team.types'
import { calculateOverallScore, scoreBg, scoreColor, scoreLabel } from '@/utils/scores'
import ExcelDownloadButton from '@/components/excel/ExcelDownloadButton'
import PDFDownloadButton from '@/components/pdf/PDFDownloadButton'
import { FileText, Loader2, Target, Zap, ShieldCheck, TrendingUp } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function LivePreview({ team }: { team: TeamProfile }) {
  const { overall, averages } = calculateOverallScore(team)
  const { p1, p2, p3, p4, p5, p6, p7, p8, p9 } = averages
  const pStats = [
    { id: 'P1', val: p1 }, { id: 'P2', val: p2 }, { id: 'P3', val: p3 },
    { id: 'P4', val: p4 }, { id: 'P5', val: p5 }, { id: 'P6', val: p6 },
    { id: 'P7', val: p7 }, { id: 'P8', val: p8 }, { id: 'P9', val: p9 },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white space-y-8 scrollbar-hide">
      <div className="space-y-1">
        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Profiler Summary</h3>
        <h2 className="text-lg font-black text-slate-900 truncate leading-tight">{team.startupName || 'Draft Profile'}</h2>
      </div>

      {/* Hero Score */}
      <div className="bg-slate-900 p-6 rounded-[32px] text-white space-y-4 relative overflow-hidden shadow-xl shadow-slate-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="flex justify-between items-center relative z-10">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">Weighted Global</span>
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
        <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-1">Parameters (P1-P9)</div>
        <div className="grid grid-cols-3 gap-2">
          {pStats.map((s) => (
            <div key={s.id} className="p-3 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col items-center gap-1 group">
               <span className="text-[9px] font-bold text-slate-500">{s.id}</span>
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
         <div className="text-[10px] font-black text-slate-600 uppercase tracking-wider px-1">Professional Exports</div>
         <div className="flex flex-col gap-2">
            <ExcelDownloadButton team={team} />
            <PDFDownloadButton team={team} />
         </div>
      </div>
      
      {/* Programme Status */}
      <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-3xl space-y-2">
         <div className="flex items-center gap-2 text-indigo-900">
            <Zap size={14} className="text-indigo-600" />
            <span className="text-[9px] font-black uppercase tracking-wider">Programme Status</span>
         </div>
         <p className="text-xs font-bold text-slate-700">Under Evaluation</p>
      </div>
    </div>
  )
}
