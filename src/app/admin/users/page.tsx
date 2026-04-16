'use client'

import React, { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { 
  Users, 
  Search, 
  Shield, 
  UserPlus, 
  MoreHorizontal,
  Mail,
  Calendar,
  Loader2,
  Trash2
} from 'lucide-react'
import { cn } from '@/utils/cn'

export default function UsersManagementPage() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function fetchUsers() {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    setProfiles(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="p-10 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-600 shadow-xl shadow-indigo-100 rounded-2xl flex items-center justify-center text-white">
              <Users size={24} />
           </div>
           <div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Access Control</h1>
             <p className="text-slate-500 font-medium">Managing {profiles.length} registered system users</p>
           </div>
        </div>
        <button className="px-5 py-2.5 bg-[#0F172A] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-black/10 flex items-center gap-2">
           <UserPlus size={14} /> Invite User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, email, or role..." 
              className="w-full pl-12 pr-6 py-2 bg-slate-50 border border-transparent rounded-2xl text-xs font-medium outline-none focus:bg-white focus:border-indigo-100 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered</th>
                <th className="p-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <Loader2 className="animate-spin inline-block text-slate-300" size={32} />
                  </td>
                </tr>
              ) : profiles.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-500 flex items-center justify-center font-black text-xs">
                         {(p.full_name || 'U').charAt(0)}
                       </div>
                       <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900">{p.full_name || 'System User'}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{p.email}</span>
                       </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className={cn(
                      "inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                      p.role === 'admin' ? "bg-amber-50 text-amber-600 border-amber-100" : p.role === 'programme_team' ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-slate-50 text-slate-500 border-slate-200"
                    )}>
                      {p.role.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="p-6">
                     <span className={cn(
                       "text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                       p.status === 'approved' ? "text-emerald-600" : p.status === 'pending' ? "text-amber-500" : "text-rose-500"
                     )}>
                       <div className={cn("w-1.5 h-1.5 rounded-full", p.status === 'approved' ? "bg-emerald-500" : p.status === 'pending' ? "bg-amber-500" : "bg-rose-500")} />
                       {p.status}
                     </span>
                  </td>
                  <td className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-6 text-right">
                    <button className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                       <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
