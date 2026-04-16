'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function PendingPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(false)

  async function checkStatus() {
    setChecking(true)
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: profile } = await supabase
      .from('profiles')
      .select('status')
      .eq('id', user.id)
      .single()

    if (profile?.status === 'approved') {
      router.push('/startup/profile')
    } else if (profile?.status === 'rejected') {
      router.push('/login?error=rejected')
    }
    setChecking(false)
  }

  async function handleLogout() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#F4F6F9',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16,
        border: '1px solid #DDE3EC', padding: 40,
        maxWidth: 440, width: '100%', textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0F2647', marginBottom: 8 }}>
          Waiting for approval
        </h1>
        <p style={{ fontSize: 13, color: '#8A9BB0', marginBottom: 24, lineHeight: 1.6 }}>
          Your registration has been received. The InUnity team
          will review and approve your account shortly.
          You will be able to access your form once approved.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={checkStatus}
            disabled={checking}
            style={{
              background: '#0F2647', color: '#fff', border: 'none',
              borderRadius: 8, padding: '9px 20px', fontSize: 13,
              fontWeight: 600, cursor: checking ? 'wait' : 'pointer',
            }}
          >
            {checking ? 'Checking...' : 'Check Status'}
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: '#F4F6F9', color: '#3B5070',
              border: '1px solid #DDE3EC', borderRadius: 8,
              padding: '9px 20px', fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
