'use client'

import React, { useState } from 'react'
import { FileText, Loader2 } from 'lucide-react'
import type { TeamProfile } from '@/types/team.types'

export default function PDFDownloadButton({ team }: { team: TeamProfile }) {
  const [isDownloading, setIsDownloading] = useState(false)

  const isComplete = !!(
    team?.startupName?.trim() && 
    team?.teamName?.trim() && 
    team?.problemStatement?.trim() && 
    team?.solutionDescription?.trim()
  )

  const handleDownload = async () => {
    if (!isComplete) {
      alert('⚠️ Required Information Missing\n\nPlease provide the Startup Name, Team Name, Problem Statement, and Solution details before generating the report.')
      return
    }
    if (!team?.id || isDownloading) return
    
    try {
      setIsDownloading(true)
      const res = await fetch(`/api/teams/${team.id}/pdf`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to generate PDF' }))
        throw new Error(err.error || 'Generate failed')
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${(team.startupName || 'Startup').replace(/[^a-zA-Z0-9]/g, '_')}-Stage-Profile.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    } catch (err) {
      console.error('[PDF Export] Failed:', err)
      alert('Could not generate PDF. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2
                 ${isDownloading 
                   ? 'bg-slate-800 text-slate-500 cursor-wait' 
                   : !isComplete
                     ? 'bg-slate-800/40 text-slate-500 cursor-not-allowed opacity-60'
                     : 'bg-slate-800 text-white hover:bg-slate-700 active:scale-95'}`}
      title={!isComplete ? 'Complete Startup Name, Team Name, Problem Statement, and Solution to enable export' : ''}
    >
      {isDownloading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <FileText size={14} className={!isComplete ? 'text-slate-600' : 'text-amber-500'} />
      )}
      {isDownloading ? 'Generating...' : 'PDF Brief'}
    </button>
  )
}
