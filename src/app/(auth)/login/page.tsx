'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Create client inline — avoids any import chain issues
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    console.log('[Login] Attempting login for:', email)
    console.log('[Login] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (authError) {
      console.error('[Login] Error:', authError.message, authError.status)
      setError(authError.message)
      setLoading(false)
      return
    }

    console.log('[Login] Success. User:', data.user?.email)
    router.push('/profiler')
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F4F6F9',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        border: '1px solid #DDE3EC',
        padding: 32,
        width: '100%',
        maxWidth: 360,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: '#0F2647',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 13, color: '#E8A020',
          }}>
            IU
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#0F2647', fontSize: 13 }}>
              Startup Diagnosis Profiler
            </div>
            <div style={{ color: '#8A9BB0', fontSize: 11 }}>
              InUnity Private Limited
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#0F2647', marginBottom: 20 }}>
          Sign in
        </h1>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#3B5070', display: 'block', marginBottom: 4 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%', padding: '8px 12px',
                border: '1px solid #DDE3EC', borderRadius: 8,
                fontSize: 13, color: '#0F2647',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#3B5070', display: 'block', marginBottom: 4 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              required
              style={{
                width: '100%', padding: '8px 12px',
                border: '1px solid #DDE3EC', borderRadius: 8,
                fontSize: 13, color: '#0F2647',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#FDECEA', border: '1px solid #F0997B',
              borderRadius: 8, padding: '8px 12px',
              fontSize: 12, color: '#E84B3A',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#8A9BB0' : '#0F2647',
              color: '#fff', border: 'none', borderRadius: 8,
              padding: '10px 0', fontSize: 13, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ marginTop: 16, fontSize: 10, color: '#8A9BB0', wordBreak: 'break-all' }}>
            URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'}<br/>
            Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ NOT SET'}
          </div>
        )}
      </div>
    </div>
  )
}
