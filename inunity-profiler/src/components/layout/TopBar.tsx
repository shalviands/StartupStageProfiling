'use client'

import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import { useUIStore } from '@/store/uiStore'
import { useTeams } from '@/hooks/useTeams'
import dynamic from 'next/dynamic'

const PDFDownloadButton = dynamic(
  () => import('@/components/pdf/PDFDownloadButton'),
  { ssr: false }
)

const ExcelDownloadButton = dynamic(
  () => import('@/components/excel/ExcelDownloadButton'),
  { ssr: false }
)

export default function TopBar() {
  const router = useRouter()
  const { activeTeamId, showPreview, togglePreview } = useUIStore()
  const { data: teams = [] } = useTeams()
  const activeTeam = teams.find(t => t.id === activeTeamId) ?? null

  async function handleLogout() {
    const supabase = getSupabaseBrowser()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="bg-navy flex items-center justify-between
                        px-4 py-2.5 flex-shrink-0 z-10">
      {/* Branding */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gold text-navy flex
                        items-center justify-center font-black text-xs
                        flex-shrink-0">
          IU
        </div>
        <div>
          <div className="text-white font-bold text-[13px] leading-tight">
            Startup Diagnosis Profiler
          </div>
          <div className="text-silver text-[10px]">
            InUnity Private Limited
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {activeTeam && (
          <>
            <button
              onClick={togglePreview}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                          text-xs font-semibold transition-colors
                          ${showPreview
                            ? 'bg-gold text-navy'
                            : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
            >
              {showPreview ? '✏ Form' : '👁 Preview'}
            </button>
            <ExcelDownloadButton team={activeTeam} />
            <PDFDownloadButton team={activeTeam} />
          </>
        )}
        <button
          onClick={handleLogout}
          className="bg-white/10 text-white hover:bg-white/20 px-3 py-1.5
                     rounded-lg text-xs font-semibold transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
