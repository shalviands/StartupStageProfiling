'use client'

import React from 'react'
import { FileSpreadsheet } from 'lucide-react'
import type { TeamProfile } from '@/types/team.types'
import { calculateScores } from '@/utils/scores'

export default function ExcelDownloadButton({ team }: { team: TeamProfile }) {
  const handleExport = async () => {
    const { utils, writeFile } = await import('xlsx')
    const scores = calculateScores(team)

    const data = [
      ['INUNITY STARTUP DIAGNOSIS REPORT', ''],
      ['GENERATED', new Date().toLocaleString()],
      ['', ''],
      ['FIELD', 'VALUE'],
      ['Startup Name', team.startupName],
      ['Team ID', team.teamName],
      ['Interview Date', team.interviewDate],
      ['Interviewer', team.interviewer],
      ['Sector', team.sector],
      ['Institution', team.institution],
      ['Team Size', team.teamSize],
      ['TRL', team.trl],
      ['BRL', team.brl],
      ['CRL', team.crl],
      ['', ''],
      ['SCORES', ''],
      ['Value Proposition', scores.problem || 'N/A'],
      ['Market Validation', scores.market || 'N/A'],
      ['Business Model', scores.biz || 'N/A'],
      ['Pitch & Deck', scores.pitch || 'N/A'],
      ['OVERALL DIAGNOSTIC', scores.overall || 'N/A'],
      ['', ''],
      ['AI ANALYSIS', ''],
      ['Readiness Summary', team.readinessSummary],
      ['Recommendations', team.recommendations],
      ['', ''],
      ['ROADMAP', ''],
      ['PRIORITY', 'ACTION', 'SUPPORT', 'BY WHEN', 'STATUS'],
      ...(team.roadmap || []).map(r => [r.priority, r.action, r.supportFrom, r.byWhen]),
      ['', ''],
      ['GENERAL NOTES', ''],
      ['Strengths', team.strengths],
      ['Gaps', team.gaps],
      ['Mentor', team.mentor],
      ['Final Notes', team.notes],
    ]

    const ws = utils.aoa_to_sheet(data)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Diagnosis')

    writeFile(wb, `${team.startupName || 'Startup'}-Analysis.xlsx`)
  }

  return (
    <button
      onClick={handleExport}
      className="bg-white/10 text-white hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2"
    >
      <FileSpreadsheet size={14} /> Analysis
    </button>
  )
}
