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
    <div className="bg-white rounded-3xl p-10 w-full shadow-2xl border border-navy/5 animate-section-in">
      {/* Logo */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-11 h-11 rounded-2xl bg-navy flex items-center justify-center font-extrabold text-sm text-gold shadow-md">
          IU
        </div>
        <div>
          <div className="font-extrabold text-navy text-sm tracking-tight">
            Venture Lab
          </div>
          <div className="text-silver text-[10px] font-bold uppercase tracking-widest">
            InUnity Private Limited
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-navy mb-2 tracking-tight">
        Create Account
      </h1>
      <p className="text-sm text-slate leading-relaxed font-medium mb-8">
        Begin your strategic diagnosis and join the InUnity ecosystem.
      </p>

      <form onSubmit={handleRegister} className="flex flex-col gap-6">
        
        {/* Role Selector */}
        <div className="space-y-3">
           <label className="text-[10px] font-extrabold text-navy uppercase tracking-widest block pl-1">
             Registering As
           </label>
           <div className="grid grid-cols-2 gap-2 bg-smoke p-1.5 rounded-xl border border-rule">
              <button
                type="button"
                onClick={() => update('role', 'startup')}
                className={cn(
                  "py-2.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all",
                  form.role === 'startup' ? "bg-white text-navy shadow-sm" : "text-silver hover:text-slate"
                )}
              >
                Startup Founder
              </button>
              <button
                type="button"
                onClick={() => update('role', 'programme_team')}
                className={cn(
                  "py-2.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all",
                  form.role === 'programme_team' ? "bg-white text-navy shadow-sm" : "text-silver hover:text-slate"
                )}
              >
                Programme Team
              </button>
           </div>
        </div>

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

        {form.role === 'startup' && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
             <label className="text-[10px] font-extrabold text-navy uppercase tracking-widest block pl-1">
               Startup Name
             </label>
             <input
               type="text"
               value={form.startupName}
               onChange={e => update('startupName', e.target.value)}
               placeholder="Acme Inc"
               required
               className="w-full border border-rule rounded-xl px-4 py-3 text-sm text-navy bg-white outline-none focus:border-navy focus:ring-4 focus:ring-navy/5 placeholder:text-silver/60 transition-all font-medium"
             />
          </div>
        )}

        <div className="space-y-2">
           <label className="text-[10px] font-extrabold text-navy uppercase tracking-widest block pl-1">
             Email Address
           </label>
           <input
             type="email"
             value={form.email}
             onChange={e => update('email', e.target.value)}
             placeholder="you@startup.com"
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
            'Complete Registration'
          )}
        </button>

        <p className="text-xs text-slate text-center font-semibold mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-navy font-extrabold underline decoration-navy/20 hover:decoration-navy transition-all">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
