'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import { LogOut, User } from 'lucide-react'
import { UserProfile } from '@/types/auth'

export default function ProgrammeTopBar({ profile }: { profile: UserProfile }) {
  const router = useRouter()
  const supabase = getSupabaseBrowser()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="px-8 py-4 bg-white border-b border-rule flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black text-silver uppercase tracking-widest border-r border-rule pr-4">Programme Management</span>
        <span className="text-[10px] font-black text-navy uppercase tracking-widest pl-1">InUnity Private Limited</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 pr-6 border-r border-rule">
           <div className="text-right">
             <div className="text-[11px] font-black text-navy leading-none">{profile.full_name || 'Programme Member'}</div>
             <div className="text-[9px] font-bold text-silver uppercase tracking-wider mt-1">{profile.role.replace('_', ' ')}</div>
           </div>
           <div className="w-10 h-10 rounded-full bg-smoke flex items-center justify-center text-silver overflow-hidden border border-rule">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={18} />
              )}
           </div>
        </div>

        <button 
          onClick={handleSignOut}
          className="flex items-center gap-2 text-silver hover:text-coral transition-all group"
        >
          <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
          <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </header>
  )
}
