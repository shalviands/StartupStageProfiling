'use client'

import React, { useState } from 'react'
import { FileText, Loader2 } from 'lucide-react'
import type { TeamProfile } from '@/types/team.types'

export default function PDFDownloadButton({ team }: { team: TeamProfile }) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
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
      a.download = `${(team.startupName || 'Startup').replace(/[^a-zA-Z0-9]/g, '_')}-Brief.pdf`
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
      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2.5
                 ${isDownloading 
                   ? 'bg-slate-100 text-slate-500 cursor-wait' 
                   : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg shadow-slate-200'}`}
    >
      {isDownloading ? (
        <Loader2 size={16} className="animate-spin text-slate-400" />
      ) : (
        <FileText size={16} />
      )}
      {isDownloading ? 'Generating Report...' : 'Download PDF Report'}
    </button>
  )
}
