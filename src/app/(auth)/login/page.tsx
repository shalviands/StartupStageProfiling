'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { getHomeRouteForRole } from '@/utils/navigation'
import { Loader2, AlertCircle } from 'lucide-react'

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

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Role-aware redirection logic
    if (authData.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, status')
        .eq('id', authData.user.id)
        .single()

      if (profileError) {
        console.error('[Login] Error fetching profile:', profileError)
        setError(`Database Error: ${profileError.message}`)
        setLoading(false)
        return
      }

      if (profile) {
        const route = getHomeRouteForRole(profile.role, profile.status)
        router.push(route)
        router.refresh()
      } else {
        setError('Your account exists but has no profile record. Please register again or contact support.')
        setLoading(false)
        return
      }
    }
  }

  return (
    <div className="bg-white rounded-3xl p-10 w-full shadow-2xl border border-navy/5 animate-section-in">
      {/* Logo */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-navy flex items-center justify-center font-extrabold text-lg text-gold shadow-md">
          IU
        </div>
        <div>
          <div className="font-extrabold text-navy text-sm tracking-tight">
            InUnity
          </div>
          <div className="text-silver text-[10px] font-bold uppercase tracking-widest">
            Startup Stage Profiler
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy mb-2 tracking-tight">
          Venture Login
        </h1>
        <p className="text-sm text-slate leading-relaxed font-medium">
          Sign in to access your strategic diagnostic dashboard and venture metrics.
        </p>
      </div>

      {rejectedError && (
        <div className="bg-coral-lt border border-coral/30 rounded-xl p-4 mb-6 flex gap-3 text-xs font-semibold text-coral leading-relaxed">
          <AlertCircle size={16} className="shrink-0" />
          <span>Your registration was not approved. Please contact the InUnity team for more information.</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-horizontal flex flex-col gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold text-navy uppercase tracking-widest block pl-1">
            Identity / Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="name@inunity.in"
            required
            className="w-full border border-rule rounded-xl px-4 py-3 text-sm text-navy bg-white outline-none focus:border-navy focus:ring-4 focus:ring-navy/5 placeholder:text-silver/60 transition-all font-medium"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-extrabold text-navy uppercase tracking-widest block pl-1">
            Security / Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full border border-rule rounded-xl px-4 py-3 text-sm text-navy bg-white outline-none focus:border-navy focus:ring-4 focus:ring-navy/5 placeholder:text-silver/60 transition-all font-medium"
          />
        </div>

        {error && (
          <div className="bg-coral-lt border border-coral/20 rounded-xl p-4 text-xs font-bold text-coral text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-navy text-white rounded-xl py-4 text-xs font-extrabold uppercase tracking-widest shadow-lg shadow-navy/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            'Sign in to Platform'
          )}
        </button>
      </form>

      <div className="mt-10 pt-8 border-t border-rule text-center">
        <p className="text-[10px] text-slate font-extrabold uppercase tracking-widest mb-4">
          New to InUnity?
        </p>
        <Link 
          href="/register" 
          className="block w-full py-4 rounded-xl border-2 border-navy text-navy text-xs font-extrabold uppercase tracking-widest hover:bg-smoke active:scale-[0.98] transition-all"
        >
          Create Startup Account
        </Link>
      </div>
      
      <p className="text-[9px] text-silver font-bold mt-6 text-center uppercase tracking-widest">
        Protected by InUnity Security Protocol
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
       <div className="flex flex-col items-center justify-center gap-4 text-silver">
         <Loader2 className="animate-spin" size={32} />
         <span className="text-[10px] font-black uppercase tracking-widest">Initialising Session...</span>
       </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
