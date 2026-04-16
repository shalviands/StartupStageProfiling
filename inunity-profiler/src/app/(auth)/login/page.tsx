'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

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

    const supabase = getSupabaseBrowser()
    const { error } = await supabase.auth.signInWithPassword({
      email, password
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/profiler')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-smoke font-sans">
      <div className="bg-white rounded-3xl border border-rule p-10
                      w-full max-w-md shadow-xl shadow-navy/5">
        {/* Logo */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-navy flex items-center
                          justify-center shadow-lg shadow-navy/20">
            <span className="text-gold font-black text-xl italic tracking-tighter">IU</span>
          </div>
          <div>
            <div className="font-bold text-navy text-lg leading-tight">
              Startup Diagnosis Profiler
            </div>
            <div className="text-silver text-xs font-medium uppercase tracking-widest">
              InUnity Private Limited
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-black text-navy mb-2">Sign in</h1>
          <p className="text-silver text-sm">Enter your credentials to access the profiler</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate uppercase tracking-wider block ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@inunity.co"
              className="w-full border border-rule rounded-xl px-4 py-3
                         text-sm text-navy outline-none
                         focus:border-navy focus:ring-4
                         focus:ring-navy/5 transition-all
                         placeholder:text-silver/50"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate uppercase tracking-wider block ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-rule rounded-xl px-4 py-3
                         text-sm text-navy outline-none
                         focus:border-navy focus:ring-4
                         focus:ring-navy/5 transition-all
                         placeholder:text-silver/50"
              required
            />
          </div>
          
          {error && (
            <div className="text-xs text-coral font-bold bg-coral-lt rounded-xl px-4 py-3 border border-coral/20 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-coral animate-pulse" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-white rounded-xl py-4
                       text-sm font-bold hover:shadow-lg hover:shadow-navy/20
                       active:scale-[0.98] transition-all
                       disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin text-gold" />
                Signing in...
              </>
            ) : 'Access Dashboard'}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-smoke flex flex-col items-center gap-4">
          <div className="text-[10px] text-silver font-medium text-center uppercase tracking-widest max-w-[240px]">
            Enterprise internal tool protected by InUnity Security Protocols
          </div>
        </div>
      </div>
    </div>
  )
}
