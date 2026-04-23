'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { cn } from '@/utils/cn'
import { Loader2, AlertCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: '',
    startupName: '',
    email: '',
    password: '',
    confirmPassword: '',
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
          startup_name: form.startupName.trim(),
          role: 'startup', // Default role for common signup
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Fallback: Manually trigger profile sync incase DB trigger failed
    try {
      await fetch('/api/auth/sync-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: form.fullName.trim(), startupName: form.startupName.trim() })
      })
    } catch (e) {
      console.error('[Registration] Profile sync check failed', e)
    }

    // Success - either they are logged in or they need to confirm email
    router.push('/pending')
  }

  return (
    <div className="bg-white rounded-3xl p-10 w-full shadow-2xl border border-navy/5 animate-section-in">
      {/* Logo */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-navy flex items-center justify-center font-extrabold text-sm text-gold shadow-md">
          IU
        </div>
        <div>
          <div className="font-extrabold text-navy text-sm tracking-tight">
            InUnity
          </div>
          <div className="text-silver text-[10px] font-bold uppercase tracking-widest">
            Strategic Profiler
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-navy mb-2 tracking-tight">
        Venture Registration
      </h1>
      <p className="text-sm text-slate leading-relaxed font-medium mb-10">
        Enter your details to create an account and begin your diagnostic journey.
      </p>

      <form onSubmit={handleRegister} className="flex flex-col gap-6">
        
        <div className="space-y-2">
           <label className="text-[10px] font-extrabold text-navy uppercase tracking-widest block pl-1">
             Full Name
           </label>
           <input
             type="text"
             value={form.fullName}
             onChange={e => update('fullName', e.target.value)}
             placeholder="Jane Doe"
             required
             className="w-full border border-rule rounded-xl px-4 py-3 text-sm text-navy bg-white outline-none focus:border-navy focus:ring-4 focus:ring-navy/5 placeholder:text-silver/60 transition-all font-medium"
           />
        </div>

        <div className="space-y-2">
           <label className="text-[10px] font-extrabold text-navy uppercase tracking-widest block pl-1">
             Venture / Organisation Name
           </label>
           <input
             type="text"
             value={form.startupName}
             onChange={e => update('startupName', e.target.value)}
             placeholder="Acme Ventures"
             required
             className="w-full border border-rule rounded-xl px-4 py-3 text-sm text-navy bg-white outline-none focus:border-navy focus:ring-4 focus:ring-navy/5 placeholder:text-silver/60 transition-all font-medium"
           />
        </div>

        <div className="space-y-2">
           <label className="text-[10px] font-extrabold text-navy uppercase tracking-widest block pl-1">
             Business Email
           </label>
           <input
             type="email"
             value={form.email}
             onChange={e => update('email', e.target.value)}
             placeholder="you@company.com"
             required
             className="w-full border border-rule rounded-xl px-4 py-3 text-sm text-navy bg-white outline-none focus:border-navy focus:ring-4 focus:ring-navy/5 placeholder:text-silver/60 transition-all font-medium"
           />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-navy uppercase tracking-widest block pl-1">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-rule rounded-xl px-4 py-3 text-sm text-navy bg-white outline-none focus:border-navy focus:ring-4 focus:ring-navy/5 placeholder:text-silver/60 transition-all font-medium"
              />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-navy uppercase tracking-widest block pl-1">
                Verify
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => update('confirmPassword', e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-rule rounded-xl px-4 py-3 text-sm text-navy bg-white outline-none focus:border-navy focus:ring-4 focus:ring-navy/5 placeholder:text-silver/60 transition-all font-medium"
              />
           </div>
        </div>

        {error && (
          <div className="bg-coral-lt border border-coral/20 rounded-xl p-4 text-xs font-bold text-coral text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-navy text-white rounded-xl py-4 text-xs font-extrabold uppercase tracking-widest shadow-lg shadow-navy/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            'Complete Registry'
          )}
        </button>

        <p className="text-xs text-slate text-center font-semibold mt-4">
          Already verified?{' '}
          <Link href="/login" className="text-navy font-extrabold underline decoration-navy/20 hover:decoration-navy transition-all">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
