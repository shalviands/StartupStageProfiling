'use client'

import React from 'react'
import { FileSpreadsheet } from 'lucide-react'
import type { TeamProfile } from '@/types/team.types'
import { calculateOverallScore, classifyStage, getRoadmap } from '@/utils/scores'
import { PARAMETERS_CONFIG } from '@/config/parameters'

export default function ExcelDownloadButton({ team }: { team: TeamProfile }) {
  const handleExport = async () => {
    if (!team?.id) return
    const { utils, writeFile } = await import('xlsx')
    const { overall, averages } = calculateOverallScore(team)
    const { p1, p2, p3, p4, p5, p6, p7, p8, p9 } = averages
    const { stage, level, override } = classifyStage(team)
    const roadmap = getRoadmap(team)

    const wb = utils.book_new()

    // --- SHEET 1: DIAGNOSTIC SUMMARY ---
    const summaryData = [
      ['INUNITY STARTUP DIAGNOSIS - EXECUTIVE SUMMARY'],
      [''],
      ['STARTUP IDENTITY'],
      ['Startup Name', team.startupName || 'N/A'],
      ['Batch / Team ID', team.teamName || 'N/A'],
      ['Primary Sector', team.sector || 'N/A'],
      ['Institution', team.institution || 'N/A'],
      ['Team Size', team.teamSize || 'N/A'],
      [''],
      ['DIAGNOSTIC OUTPUTS'],
      ['DETECTED STAGE', stage],
      ['CLASSIFICATION TIER', `Level ${level}`],
      ['OVERALL WEIGHTED SCORE', overall.toFixed(2), 'out of 5.0'],
      ['WEAKEST LINK OVERRIDE', override || 'None (Growth Uncapped)'],
      [''],
      ['PARAMETER AVERAGES (1-5)'],
      ['P1: Founder & Problem', p1.toFixed(1)],
      ['P2: Customer Discovery', p2.toFixed(1)],
      ['P3: Product & TRL', p3.toFixed(1)],
      ['P4: Differentiation', p4.toFixed(1)],
      ['P5: Market & ICP', p5.toFixed(1)],
      ['P6: Business Model', p6.toFixed(1)],
      ['P7: Traction & CRL', p7.toFixed(1)],
      ['P8: Team Readiness', p8.toFixed(1)],
      ['P9: Advantage & Moats', p9.toFixed(1)],
      [''],
      ['Report Generated:', new Date().toLocaleString()]
    ]
    const wsSummary = utils.aoa_to_sheet(summaryData)
    wsSummary['!cols'] = [{ wch: 30 }, { wch: 40 }]
    utils.book_append_sheet(wb, wsSummary, 'Summary')

    // --- SHEET 2: DETAILED ANALYSIS ---
    const detailedData: any[][] = [
      ['PARAMETER', 'QUESTION / FIELD', 'VALUE / ENTRY', 'SCORE (1-5)']
    ]

    PARAMETERS_CONFIG.forEach(param => {
      detailedData.push(['', '', '', ''])
      detailedData.push([param.title.toUpperCase(), '', '', ''])
      
      const allQs = [...param.coreQs, ...param.deepDiveQs]
      allQs.forEach(q => {
        const fieldName = `${param.id}_${q.id}`
        const val = (team as any)[fieldName] || ''
        const score = (team as any)[`${fieldName}_score`] || 0
        detailedData.push([param.id, q.label, val, score > 0 ? score : 'Unscored'])
      })
      
      detailedData.push([param.id, 'MENTOR OBSERVATION', (team as any)[`${param.id}_observation`] || '', ''])
    })

    const wsDetailed = utils.aoa_to_sheet(detailedData)
    wsDetailed['!cols'] = [{ wch: 20 }, { wch: 35 }, { wch: 60 }, { wch: 15 }]
    utils.book_append_sheet(wb, wsDetailed, 'Parameter Breakdown')

    // --- SHEET 3: STRATEGIC ROADMAP ---
    const roadmapData = [
      ['STRATEGIC 4-WEEK SPRINT ROADMAP'],
      [''],
      ['Target Stage:', stage],
      ['Focus Tier:', `Level ${level}`],
      [''],
      ['PRIORITY', 'STRATEGIC ACTION ITEM', 'SUPPORT REQUIRED / BY', 'TIMELINE'],
      ...roadmap.map(r => [r.priority, r.action, r.supportFrom, r.byWhen])
    ]
    const wsRoadmap = utils.aoa_to_sheet(roadmapData)
    wsRoadmap['!cols'] = [{ wch: 15 }, { wch: 60 }, { wch: 30 }, { wch: 15 }]
    utils.book_append_sheet(wb, wsRoadmap, 'Sprint Roadmap')

    writeFile(wb, `${(team.startupName || 'Startup').replace(/[^a-zA-Z0-9]/g, '_')}-Evaluation.xlsx`)
  }

  return (
    <button
      onClick={handleExport}
      className="w-full border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95"
    >
      <FileSpreadsheet size={16} className="text-emerald-500" />
      Download Analysis (XLSX)
    </button>
  )
}
