'use client'

import React from 'react'
import { FileSpreadsheet } from 'lucide-react'
import type { TeamProfile } from '@/types/team.types'
import { calculateScores } from '@/utils/scores'

export default function ExcelDownloadButton({ team }: { team: TeamProfile }) {
  const isComplete = !!(
    team?.startupName?.trim() && 
    team?.teamName?.trim() && 
    team?.problemStatement?.trim() && 
    team?.solutionDescription?.trim()
  )

  const handleExport = async () => {
    if (!isComplete) {
      alert('⚠️ Required Information Missing\n\nPlease provide the Startup Name, Team Name, Problem Statement, and Solution details before exporting the sheet.')
      return
    }
    if (!team?.id) return
    const { utils, writeFile } = await import('xlsx')
    const scores = calculateScores(team)

    const data = [
      ['INUNITY STARTUP STAGE PROFILE', ''],
      ['Profile Name', team.teamName],
      ['Startup Name', team.startupName],
      ['Date Generated', new Date().toLocaleString()],
      ['', ''],

      ['SECTION 1: BASIC INFORMATION', ''],
      ['Sector', team.sector],
      ['Institution', team.institution],
      ['Team Size', team.teamSize],
      ['Interviewer', team.interviewer],
      ['Interview Date', team.interviewDate],
      ['', ''],

      ['SECTION 2: READINESS SCORE', ''],
      ['Value Proposition (Problem/Solution)', scores.problem || 'N/A'],
      ['Market Validation (Customers/Market)', scores.market || 'N/A'],
      ['Business Model (Revenue/Strategy)', scores.biz || 'N/A'],
      ['Pitch & Presentation', scores.pitch || 'N/A'],
      ['OVERALL SCORE', scores.overall || 'N/A'],
      ['', ''],

      ['SECTION 3: READINESS LEVELS', ''],
      ['Technology Readiness Level (TRL)', team.trl],
      ['Business Readiness Level (BRL)', team.brl],
      ['Commercial Readiness Level (CRL)', team.crl],
      ['', ''],

      ['SECTION 4: AI ASSESSMENT SUMMARY', ''],
      ['Key Strengths', team.strengths],
      ['Critical Gaps', team.gaps],
      ['Readiness Summary', team.readinessSummary],
      ['Key Recommendations', team.recommendations],
      ['', ''],

      ['SECTION 5: TEAM ROADMAP', ''],
      ['Priority', 'Action Item', 'Support Required', 'Timeline'],
      ...(team.roadmap || []).map(r => [r.priority, r.action, r.supportFrom, r.byWhen]),
      ['', ''],

      ['SECTION 6: INTERNAL FEEDBACK / PROGRAMME NOTES', ''],
      ['Mentor Assigned', team.mentor],
      ['Next Check-in', team.nextCheckin],
      ['Additional Notes', team.notes],
    ]

    const ws = utils.aoa_to_sheet(data)
    
    // Simple column widths for better structure
    ws['!cols'] = [
      { wch: 35 }, // Feature
      { wch: 60 }, // Value
      { wch: 25 }, // Support
      { wch: 15 }, // Timeline
    ]

    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Stage Profile')

    writeFile(wb, `${(team.startupName || 'Startup').replace(/[^a-zA-Z0-9]/g, '_')}-Stage-Profile.xlsx`)
  }

  return (
    <button
      onClick={handleExport}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2
                 ${!isComplete 
                   ? 'bg-slate-800/40 text-slate-500 cursor-not-allowed opacity-60' 
                   : 'bg-slate-800 text-white hover:bg-slate-700 active:scale-95'}`}
      title={!isComplete ? 'Complete Startup Name, Team Name, Problem Statement, and Solution to enable export' : ''}
    >
      <FileSpreadsheet size={14} className={!isComplete ? 'text-slate-600' : 'text-amber-500'} /> Analysis
    </button>
  )
}
