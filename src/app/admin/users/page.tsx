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
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

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

  async function handleRoleChange(userId: string, newRole: string) {
    setUpdating(userId)
    try {
      const res = await fetch('/api/admin/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      })
      if (res.ok) {
        setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p))
      } else {
        alert('Failed to update role')
      }
    } catch (err) {
      console.error(err)
      alert('Error updating role')
    } finally {
      setUpdating(null)
    }
  }

  const filteredProfiles = profiles.filter(p => 
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.role?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-10 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-navy shadow-xl shadow-navy/10 rounded-2xl flex items-center justify-center text-gold">
              <Users size={24} />
           </div>
           <div>
             <h1 className="text-3xl font-black text-navy tracking-tight">Access Control</h1>
             <p className="text-slate-500 font-medium tracking-tight">Managing {profiles.length} registered system users</p>
           </div>
        </div>
        <button className="px-5 py-2.5 bg-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-navy/10 flex items-center gap-2">
           <Mail size={14} /> Invite Stakeholder
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-xl shadow-navy/5">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-smoke/30">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter by name, email, or role..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:border-navy/20 focus:ring-4 focus:ring-navy/5 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Role Authority</th>
                <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</th>
                <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Onboarded</th>
                <th className="p-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <Loader2 className="animate-spin inline-block text-navy" size={32} />
                  </td>
                </tr>
              ) : filteredProfiles.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-navy text-gold flex items-center justify-center font-black text-sm shadow-inner group-hover:scale-110 transition-transform">
                         {(p.full_name || 'U').charAt(0)}
                       </div>
                       <div className="flex flex-col">
                          <span className="text-sm font-black text-navy">{p.full_name || 'System User'}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{p.email}</span>
                       </div>
                    </div>
                  </td>
                  <td className="p-6">
                    {updating === p.id ? (
                      <Loader2 className="animate-spin text-navy" size={16} />
                    ) : (
                      <select 
                        value={p.role}
                        onChange={(e) => handleRoleChange(p.id, e.target.value)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border outline-none cursor-pointer transition-all",
                          p.role === 'admin' ? "bg-amber-50 text-amber-600 border-amber-200" : p.role === 'programme_team' ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-slate-50 text-slate-500 border-slate-200"
                        )}
                      >
                        <option value="startup">Startup</option>
                        <option value="programme_team">Programme Team</option>
                        <option value="admin">Administrator</option>
                      </select>
                    )}
                  </td>
                  <td className="p-6">
                     <span className={cn(
                       "text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                       p.status === 'approved' ? "text-emerald-600" : p.status === 'pending' ? "text-amber-500" : "text-rose-500"
                     )}>
                       <div className={cn("w-2 h-2 rounded-full", p.status === 'approved' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : p.status === 'pending' ? "bg-amber-500" : "bg-rose-500")} />
                       {p.status}
                     </span>
                  </td>
                  <td className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-6 text-right">
                    <button className="p-3 text-slate-400 hover:text-coral hover:bg-coral-lt rounded-xl transition-all">
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
