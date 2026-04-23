'use client'

import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Clock, ShieldCheck, Mail, LogOut, Loader2 } from 'lucide-react'

export default function PendingPage() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="bg-white rounded-[40px] p-12 w-full shadow-2xl border border-navy/5 animate-section-in text-center relative overflow-hidden">
      {/* Background Micro-patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-navy/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Brand Icon */}
      <div className="flex justify-center mb-10">
        <div className="w-20 h-20 rounded-[32px] bg-navy flex items-center justify-center text-gold shadow-xl shadow-navy/20 relative">
          <Clock size={32} />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border border-rule flex items-center justify-center text-teal shadow-md">
            <Loader2 className="animate-spin" size={16} />
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        <div className="flex items-center justify-center gap-2 mb-2">
           <ShieldCheck size={16} className="text-silver" />
           <span className="text-[10px] font-black text-silver uppercase tracking-[0.3em]">Access Registry</span>
        </div>
        <h1 className="text-3xl font-black text-navy tracking-tight leading-tight">
          Baseline Verification <br />
          <span className="text-gold">Currently Pending</span>
        </h1>
        <p className="text-sm text-slate font-semibold leading-relaxed max-w-xs mx-auto">
          Your account request is being reviewed by the InUnity Programme Team. This usually takes 12–24 hours.
        </p>
      </div>

      {/* Info Cards */}
      <div className="space-y-3 mb-12">
        <div className="bg-smoke rounded-2xl p-5 border border-rule/50 flex items-center gap-4 text-left">
           <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-navy shadow-inner">
             <Mail size={18} />
           </div>
           <div>
             <p className="text-[10px] font-black text-navy uppercase tracking-widest">Notification</p>
             <p className="text-[11px] font-bold text-silver">We'll email you once access is granted.</p>
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
         <button
            onClick={() => window.location.reload()}
            className="w-full bg-navy text-white rounded-2xl py-5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-navy/20 hover:opacity-90 active:scale-95 transition-all"
         >
            Force Refresh Status
         </button>
         <button
            onClick={handleSignOut}
            className="w-full bg-white text-silver border border-rule rounded-2xl py-5 text-[10px] font-black uppercase tracking-widest hover:bg-smoke hover:text-navy transition-all flex items-center justify-center gap-2 group"
         >
            <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out Registry
         </button>
      </div>

      <p className="mt-10 text-[10px] font-black text-silver uppercase tracking-[0.2em] opacity-40">
        InUnity Virtual Accelerator v2.0
      </p>
    </div>
  )
}
