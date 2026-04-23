'use client'

import React, { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  AlertCircle,
  Loader2,
  Mail,
  Building
} from 'lucide-react'
import { cn } from '@/utils/cn'

export default function ProgrammeApprovalsPage() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actioningId, setActioningId] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function fetchPending() {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'startup')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('[Approvals] Fetch error:', error)
      setProfiles([])
    } else {
      setProfiles(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    async function checkRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          window.location.href = '/login'
          return
        }
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
          
        if (error || !['programme_team', 'admin'].includes(profile?.role)) {
          console.warn('[Approvals] Unauthorized or error:', error?.message)
          window.location.href = '/programme/dashboard'
          return
        }
        
        fetchPending()
      } catch (err) {
        console.error('[Approvals] Initialization failed:', err)
        window.location.href = '/login'
      }
    }
    checkRole()
  }, [])

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    setActioningId(id)
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, status })
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update')
      }
      
      setProfiles(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('[Approvals] Update failed:', err)
      alert('Failed to update status.')
    } finally {
      setActioningId(null)
    }
  }

  return (
    <div className="p-10 space-y-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-amber-500 shadow-xl shadow-amber-100 rounded-2xl flex items-center justify-center text-white">
              <Clock size={24} />
           </div>
           <div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Approval Queue</h1>
             <p className="text-slate-500 font-medium">{profiles.length} startups waiting for verification</p>
           </div>
        </div>
      </div>

      {loading ? (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-4 text-slate-400">
          <Loader2 className="animate-spin" size={32} />
          <span className="text-[10px] font-black uppercase tracking-widest">Syncing Queue...</span>
        </div>
      ) : profiles.length === 0 ? (
        <div className="bg-white rounded-[40px] border border-slate-200 p-20 text-center shadow-sm">
           <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mb-6 mx-auto">
              <CheckCircle2 size={40} />
           </div>
           <h3 className="text-xl font-black text-slate-900 mb-2">Queue Fully Cleared</h3>
           <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
             All registered startups have been reviewed. New applications will appear here in real-time.
           </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map((p) => (
            <div key={p.id} className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm hover:translate-y-[-4px] transition-all group">
               <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-amber-500 text-xl font-black">
                       {p.full_name?.charAt(0) || 'S'}
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1.5">{p.full_name || 'Incubation Founder'}</h3>
                       <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                          <Building size={12} className="text-slate-300" /> {p.startup_name || 'Acme Startup'}
                       </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
               </div>

               <div className="bg-slate-50 rounded-2xl p-4 mb-8 flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-600 truncate">{p.email}</span>
               </div>

               <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateStatus(p.id, 'approved')}
                    disabled={actioningId === p.id}
                    className="flex-1 bg-emerald-600 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                  >
                    {actioningId === p.id ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(p.id, 'rejected')}
                    disabled={actioningId === p.id}
                    className="flex-1 bg-slate-100 text-slate-500 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                  >
                    {actioningId === p.id ? <Loader2 className="animate-spin" size={14} /> : <XCircle size={14} />}
                    Reject
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
