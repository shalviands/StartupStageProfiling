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
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2
                 ${isDownloading 
                   ? 'bg-white/5 text-silver cursor-wait' 
                   : 'bg-white/10 text-white hover:bg-white/20 active:scale-95'}`}
    >
      {isDownloading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <FileText size={14} />
      )}
      {isDownloading ? 'Generating...' : 'PDF Brief'}
    </button>
  )
}
