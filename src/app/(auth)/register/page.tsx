'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { cn } from '@/utils/cn'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: '',
    startupName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'startup' as 'startup' | 'programme_team'
  })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function update(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      options: {
        data: {
          full_name: form.fullName.trim(),
          startup_name: form.role === 'startup' ? form.startupName.trim() : 'Programme Team',
          role: form.role,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    router.push('/pending')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#F4F6F9',
      fontFamily: 'system-ui, sans-serif', padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 24,
        border: '1px solid #CBD5E1', padding: 48,
        width: '100%', maxWidth: 440,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: '#0F172A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 14, color: '#F59E0B',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
          }}>IU</div>
          <div>
            <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 14, letterSpacing: '-0.01em' }}>
              Venture Lab
            </div>
            <div style={{ color: '#475569', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              InUnity Private Limited
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#020617', marginBottom: 8, letterSpacing: '-0.02em' }}>
          Create Account
        </h1>
        <p style={{ fontSize: 14, color: '#475569', marginBottom: 32, fontWeight: 500, lineHeight: 1.5 }}>
          Begin your strategic diagnosis and join the InUnity ecosystem.
        </p>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Role Selector */}
          <div style={{ marginBottom: 12 }}>
             <label style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
               Registering As
             </label>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, background: '#F1F5F9', padding: 4, borderRadius: 12 }}>
                <button
                  type="button"
                  onClick={() => update('role', 'startup')}
                  className={cn(
                    "py-2.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all",
                    form.role === 'startup' ? "bg-white text-[#0F172A] shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Startup Founder
                </button>
                <button
                  type="button"
                  onClick={() => update('role', 'programme_team')}
                  className={cn(
                    "py-2.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all",
                    form.role === 'programme_team' ? "bg-white text-[#0F172A] shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Programme Team
                </button>
             </div>
          </div>

          <div>
             <label style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
               Full Name
             </label>
             <input
               type="text"
               value={form.fullName}
               onChange={e => update('fullName', e.target.value)}
               placeholder="Jane Doe"
               required
               style={{
                 width: '100%', padding: '12px 16px', border: '1.5px solid #CBD5E1', borderRadius: 12,
                 fontSize: 14, color: '#020617', outline: 'none', boxSizing: 'border-box', fontWeight: 500
               }}
             />
          </div>

          {form.role === 'startup' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
               <label style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                 Startup Name
               </label>
               <input
                 type="text"
                 value={form.startupName}
                 onChange={e => update('startupName', e.target.value)}
                 placeholder="Acme Inc"
                 required
                 style={{
                   width: '100%', padding: '12px 16px', border: '1.5px solid #CBD5E1', borderRadius: 12,
                   fontSize: 14, color: '#020617', outline: 'none', boxSizing: 'border-box', fontWeight: 500
                 }}
               />
            </div>
          )}

          <div>
             <label style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
               Email Address
             </label>
             <input
               type="email"
               value={form.email}
               onChange={e => update('email', e.target.value)}
               placeholder="you@startup.com"
               required
               style={{
                 width: '100%', padding: '12px 16px', border: '1.5px solid #CBD5E1', borderRadius: 12,
                 fontSize: 14, color: '#020617', outline: 'none', boxSizing: 'border-box', fontWeight: 500
               }}
             />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
             <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%', padding: '12px 16px', border: '1.5px solid #CBD5E1', borderRadius: 12,
                    fontSize: 14, color: '#020617', outline: 'none', boxSizing: 'border-box', fontWeight: 500
                  }}
                />
             </div>
             <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Verify
                </label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%', padding: '12px 16px', border: '1.5px solid #CBD5E1', borderRadius: 12,
                    fontSize: 14, color: '#020617', outline: 'none', boxSizing: 'border-box', fontWeight: 500
                  }}
                />
             </div>
          </div>

          {error && (
            <div style={{
              background: '#FFF1F2', border: '1px solid #FDA4AF',
              borderRadius: 12, padding: '12px 16px',
              fontSize: 13, color: '#9F1239', fontWeight: 700,
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
              padding: '14px 0', fontSize: 13, fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              boxShadow: loading ? 'none' : '0 10px 15px -3px rgba(15, 23, 42, 0.2)',
            }}
          >
            {loading ? 'Processing...' : 'Complete Registration'}
          </button>

          <p style={{ fontSize: 12, color: '#475569', textAlign: 'center', fontWeight: 600, marginTop: 12 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#0F172A', fontWeight: 800, textDecoration: 'underline' }}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
