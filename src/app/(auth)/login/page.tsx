'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rejectedError = searchParams.get('error') === 'rejected'
  
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 24,
        padding: 40,
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 20px 50px -12px rgba(15, 23, 42, 0.12)',
        border: '1px solid rgba(15, 23, 42, 0.05)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: '#0F172A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 16, color: '#F59E0B',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
          }}>
            IU
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 15, letterSpacing: '-0.01em' }}>
              InUnity
            </div>
            <div style={{ color: '#64748B', fontSize: 12, fontWeight: 500 }}>
              Startup Stage Profiler
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 8, letterSpacing: '-0.02em' }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', lineHeight: '1.5' }}>
            Please sign in to access the InUnity Startup profiling platform.
          </p>
        </div>

        {rejectedError && (
          <div style={{
            background: '#FDECEA', border: '1px solid #F0997B',
            borderRadius: 8, padding: '10px 14px', marginBottom: 16,
            fontSize: 12, color: '#E84B3A',
          }}>
            Your registration was not approved. Please contact
            the InUnity team for more information.
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@inunity.in"
              required
              style={{
                width: '100%', padding: '12px 16px',
                border: '1.5px solid #E2E8F0', borderRadius: 12,
                fontSize: 14, color: '#0F172A',
                outline: 'none', boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#0F172A'}
              onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: '100%', padding: '12px 16px',
                border: '1.5px solid #E2E8F0', borderRadius: 12,
                fontSize: 14, color: '#0F172A',
                outline: 'none', boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#0F172A'}
              onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>

          {error && (
            <div style={{
              background: '#FFF1F2', border: '1px solid #FDA4AF',
              borderRadius: 12, padding: '12px 16px',
              fontSize: 13, color: '#E11D48',
              fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#94A3B8' : '#0F172A',
              color: '#fff', border: 'none', borderRadius: 12,
              padding: '14px 0', fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              marginTop: 8,
              boxShadow: loading ? 'none' : '0 10px 15px -3px rgba(15, 23, 42, 0.2)',
            }}
          >
            {loading ? 'Authenticating...' : 'Sign in to Platform'}
          </button>
        </form>

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#8A9BB0', textAlign: 'center', marginTop: 12 }}>
            New startup?{' '}
            <Link href="/register" style={{ color: '#0F2647', fontWeight: 600 }}>
              Register here
            </Link>
          </p>
          <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, marginTop: 12 }}>
            Protected by InUnity Security Protocol
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
       <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
         <div style={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Loading Session...</div>
       </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
