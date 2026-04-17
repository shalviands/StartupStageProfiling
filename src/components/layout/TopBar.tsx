'use client'

import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import { useUIStore } from '@/store/uiStore'
import { useTeams } from '@/hooks/useTeams'

export default function TopBar() {
  const router = useRouter()
  const { activeTeamId, showPreview, togglePreview } = useUIStore()
  const { data: teams = [] } = useTeams()
  const activeTeam = teams.find(t => t.id === activeTeamId) ?? null

  return (
    <header className="px-6 py-4 flex-shrink-0 z-20 flex items-center justify-between premium-shadow" style={{
      background: '#0F172A',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      {/* Branding */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-900 flex
                        items-center justify-center font-black text-sm
                        flex-shrink-0 shadow-lg shadow-amber-500/20">
          IU
        </div>
        <div>
          <div className="text-white font-extrabold text-sm tracking-tight leading-tight">
            Startup Stage Profiler
          </div>
          <div className="text-slate-400 text-[10px] font-medium tracking-wide uppercase">
            InUnity Private Limited
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {activeTeam && (
          <>
            <button
              onClick={togglePreview}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg
                          text-[11px] font-bold transition-all btn-hover
                          ${showPreview
                            ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/30'
                            : 'bg-slate-800 text-white hover:bg-slate-700'
                          }`}
            >
              {showPreview ? '✏ Edit Profile' : '👁 Live Preview'}
            </button>
          </>
        )}
      </div>
    </header>
  )
}
