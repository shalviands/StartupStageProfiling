'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { LogOut, User as UserIcon, Bell, Search, ShieldCheck } from 'lucide-react'
import { UserProfile } from '@/types/auth'

export default function AdminTopBar({ profile }: { profile: UserProfile }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-[80px] bg-white border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
      {/* Universal Search Bar */}
      <div className="relative w-full max-w-[400px]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="Search startups, users, or parameters..." 
          className="w-full pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-medium text-slate-900 outline-none focus:ring-2 focus:ring-[#E8A020]/20 focus:border-[#E8A020] transition-all"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all relative">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full" />
        </button>

        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-12">
           <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[11px] font-black text-slate-900 tracking-tight leading-none uppercase">{profile.full_name || 'Admin'}</span>
                <div className="flex items-center gap-1.5 mt-1 text-emerald-600">
                   <ShieldCheck size={10} />
                   <span className="text-[9px] font-black uppercase tracking-widest">{profile.role.replace('_', ' ')}</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#0F172A] flex items-center justify-center text-[#E8A020] shadow-xl shadow-black/10">
                <UserIcon size={20} />
              </div>
           </div>

           <button
             onClick={handleLogout}
             className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-all flex items-center gap-2 group"
           >
             <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
             Log Out
           </button>
        </div>
      </div>
    </header>
  )
}
