'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { LogOut, User as UserIcon } from 'lucide-react'
import { UserProfile } from '@/types/auth'

export default function StartupHeaderActions({ profile }: { profile: UserProfile }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A9BB0'
        }}>
          <UserIcon size={14} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', lineHeight: '12px' }}>
            {profile.full_name || 'Startup Founder'}
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#8A9BB0', textTransform: 'uppercase', marginTop: 1 }}>
            {profile.role.replace('_', ' ')}
          </span>
        </div>
      </div>

      <button
        onClick={handleLogout}
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#EF4444',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: 8,
          padding: '6px 12px',
          fontSize: 10,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          transition: 'all 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)')}
        onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
      >
        <LogOut size={12} />
        SIGN OUT
      </button>
    </div>
  )
}
