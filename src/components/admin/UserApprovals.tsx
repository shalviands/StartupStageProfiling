'use client'

import React, { useState, useEffect } from 'react'
import { Check, X, User, Shield, Loader2, AlertCircle, ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

interface UserProfile {
  id: string
  full_name: string
  email: string
  role: 'startup' | 'programme_team'
  startup_name?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export default function UserApprovals() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [pendingRoles, setPendingRoles] = useState<Record<string, 'startup' | 'programme_team'>>({})

  useEffect(() => {
    fetchPendingUsers()
  }, [])

  async function fetchPendingUsers() {
    try {
      const res = await fetch('/api/admin/pending-users')
      const data = await res.json()
      setUsers(data)
      
      // Initialize pending roles state
      const roles: Record<string, 'startup' | 'programme_team'> = {}
      data.forEach((u: UserProfile) => {
        roles[u.id] = u.role
      })
      setPendingRoles(roles)
    } catch (err) {
      console.error('Failed to fetch users', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(userId: string, status: 'approved' | 'rejected') {
    setProcessing(userId)
    const selectedRole = pendingRoles[userId]
    
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status, role: selectedRole })
      })
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId))
      }
    } catch (err) {
      console.error('Action failed', err)
    } finally {
      setProcessing(null)
    }
  }

  const toggleRole = (userId: string) => {
    setPendingRoles(prev => ({
      ...prev,
      [userId]: prev[userId] === 'startup' ? 'programme_team' : 'startup'
    }))
  }

  if (loading) return (
    <div className="py-10 flex flex-col items-center justify-center gap-2 text-silver">
      <Loader2 className="animate-spin" size={24} />
      <span className="text-[10px] font-black uppercase tracking-widest">Accessing Registry...</span>
    </div>
  )

  if (users.length === 0) return (
    <div className="bg-smoke rounded-3xl p-10 border border-rule/50 flex flex-col items-center justify-center text-center gap-3">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal shadow-inner">
        <Check size={24} />
      </div>
      <div>
        <p className="text-sm font-black text-navy uppercase tracking-tight">Queue Clear</p>
        <p className="text-[10px] text-silver font-bold uppercase tracking-widest">All registration requests processed</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {users.map((user) => {
        const currentRole = pendingRoles[user.id] || user.role
        return (
          <div key={user.id} className="bg-white border border-rule rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg hover:shadow-navy/5 transition-all group">
            <div className="flex items-center gap-5">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                currentRole === 'startup' ? "bg-navy text-gold" : "bg-purple text-white"
              )}>
                {currentRole === 'startup' ? <User size={24} /> : <Shield size={24} />}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-0.5">
                  <span className="font-black text-navy tracking-tight">{user.full_name}</span>
                  <button 
                    onClick={() => toggleRole(user.id)}
                    className={cn(
                      "text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md border flex items-center gap-1.5 transition-all group/role",
                      currentRole === 'startup' ? "bg-smoke border-rule text-silver hover:bg-navy/5" : "bg-purple-lt border-purple/20 text-purple hover:bg-purple/10"
                    )}
                  >
                    {currentRole.replace('_', ' ')}
                    <ChevronDown size={10} className="group-hover/role:translate-y-0.5 transition-transform" />
                  </button>
                </div>
                <div className="text-[11px] text-slate font-bold">{user.email}</div>
                {user.startup_name && (
                  <div className="text-[10px] text-silver font-medium mt-1">Venture: <span className="text-navy">{user.startup_name}</span></div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleApprove(user.id, 'rejected')}
                disabled={!!processing}
                className="px-6 py-3 bg-smoke text-silver rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-coral-lt hover:text-coral transition-all active:scale-95 flex items-center gap-2"
              >
                <X size={14} /> Deny
              </button>
              <button
                onClick={() => handleApprove(user.id, 'approved')}
                disabled={!!processing}
                className="px-6 py-3 bg-navy text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-navy/90 transition-all shadow-lg shadow-navy/20 active:scale-95 flex items-center justify-center gap-2 min-w-[120px]"
              >
                {processing === user.id ? <Loader2 className="animate-spin" size={14} /> : (
                  <>
                    <Check size={14} className="text-gold" /> Approve Access
                  </>
                )}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
