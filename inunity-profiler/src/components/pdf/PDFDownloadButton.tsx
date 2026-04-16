'use client'

import React, { useState, useEffect } from 'react'
import { FileText, Loader2 } from 'lucide-react'
import type { TeamProfile } from '@/types/team.types'
import dynamic from 'next/dynamic'

// Dynamic import — prevents SSR errors
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-white/10 text-white/50 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-not-allowed">
        <Loader2 size={14} className="animate-spin" /> Preparing...
      </div>
    )
  }
)

const DiagnosticPDF = dynamic(
  () => import('./DiagnosticPDF'),
  { ssr: false }
)

export default function PDFDownloadButton({ team }: { team: TeamProfile }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return (
    <div className="bg-white/10 text-white/50 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2">
      <FileText size={14} /> Brief
    </div>
  )

  const filename = `${(team.startupName || 'Startup').replace(/[^a-zA-Z0-9]/g, '_')}-Brief.pdf`

  return (
    <PDFDownloadLink
      document={<DiagnosticPDF team={team} />}
      fileName={filename}
    >
      {((params: any) => {
        const { loading } = params;
        return (
          <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            loading ? 'bg-white/5 text-silver' : 'bg-white/10 text-white hover:bg-white/20'
          }`}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
            {loading ? 'Generating...' : 'Download Brief'}
          </div>
        )
      }) as any}
    </PDFDownloadLink>
  )
}
