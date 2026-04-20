'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { XCircle, Mail, LogOut, ArrowLeft, RefreshCw, Loader2 } from 'lucide-react'

export default function RejectedPage() {
  const router = useRouter()

    router.push('/login')
  }

  const [showReapply, setShowReapply] = useState(false)
  const [cohorts, setCohorts] = useState<{id: string, name: string}[]>([])
  const [selectedCohort, setSelectedCohort] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function fetchCohorts() {
    setLoading(true)
    try {
      const res = await fetch('/api/cohorts?mode=public')
      const data = await res.json()
      setCohorts(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleReapply() {
    if (!selectedCohort) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/startup/reapply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cohortId: selectedCohort })
      })
      if (res.ok) {
        router.push('/pending')
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to re-apply')
      }
    } catch (err) {
      setError('Internal server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-[40px] p-12 w-full shadow-2xl border border-navy/5 animate-section-in text-center relative overflow-hidden">
      {/* Background Micro-patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-navy/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Brand Icon */}
      <div className="flex justify-center mb-10">
        <div className="w-20 h-20 rounded-[32px] bg-rose-50 flex items-center justify-center text-rose-500 shadow-xl shadow-rose-500/10 border border-rose-100">
          <XCircle size={36} />
        </div>
      </div>

      <div className="space-y-4 mb-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-[10px] font-black text-silver uppercase tracking-[0.3em]">Access Registry</span>
        </div>
        <h1 className="text-3xl font-black text-navy tracking-tight leading-tight">
          Application <br />
          <span className="text-rose-500">Not Approved</span>
        </h1>
        <p className="text-sm text-slate font-semibold leading-relaxed max-w-xs mx-auto">
          {showReapply 
            ? "Choose a different cohort to re-apply. Your request will be reviewed by the new cohort's administrator."
            : "Unfortunately, your access request was not approved at this time. If you believe this is an error, please contact the InUnity Programme Team directly."
          }
        </p>
      </div>

      {/* Info Cards */}
      {showReapply ? (
        <div className="space-y-4 mb-10">
          <div className="relative">
             <select
               value={selectedCohort}
               onChange={e => setSelectedCohort(e.target.value)}
               className="w-full border border-rule rounded-2xl px-5 py-4 text-sm text-navy bg-smoke/50 outline-none focus:border-navy focus:ring-4 focus:ring-navy/5 appearance-none font-bold transition-all"
               disabled={loading}
             >
               <option value="">Select a new cohort...</option>
               {cohorts.map(c => (
                 <option key={c.id} value={c.id}>{c.name}</option>
               ))}
             </select>
             <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-silver">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
             </div>
          </div>
          {error && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{error}</p>}
        </div>
      ) : (
        <div className="space-y-3 mb-12">
          <div className="bg-smoke rounded-2xl p-5 border border-rule/50 flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-navy shadow-inner">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-navy uppercase tracking-widest">Contact Support</p>
              <p className="text-[11px] font-bold text-silver">Reach out to the InUnity team for clarification.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {showReapply ? (
          <>
            <button
              onClick={handleReapply}
              disabled={loading || !selectedCohort}
              className="w-full bg-navy text-white rounded-2xl py-5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-navy/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />}
              Submit Re-Application
            </button>
            <button
              onClick={() => setShowReapply(false)}
              className="w-full bg-white text-silver border border-rule rounded-2xl py-5 text-[10px] font-black uppercase tracking-widest hover:bg-smoke hover:text-navy transition-all"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setShowReapply(true)
                if (cohorts.length === 0) fetchCohorts()
              }}
              className="w-full bg-gold text-navy rounded-2xl py-5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-gold/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
              Try Another Cohort
            </button>
            <button
              onClick={handleSignOut}
              className="w-full bg-white text-silver border border-rule rounded-2xl py-5 text-[10px] font-black uppercase tracking-widest hover:bg-smoke hover:text-navy transition-all flex items-center justify-center gap-2 group"
            >
              <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </>
        )}
      </div>

      <p className="mt-10 text-[10px] font-black text-silver uppercase tracking-[0.2em] opacity-40">
        InUnity Virtual Accelerator v2.0
      </p>
    </div>
  )
}
