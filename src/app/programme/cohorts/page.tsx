'use client'

import React, { useEffect, useState } from 'react'
import { 
  Users, 
  Plus, 
  Search, 
  UserPlus, 
  LayoutGrid, 
  Loader2, 
  ShieldCheck,
  Building2,
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/utils/cn'

export default function CohortManagementPage() {
  const [cohorts, setCohorts] = useState<any[]>([])
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCohortName, setNewCohortName] = useState('')

  async function fetchData() {
    setLoading(true)
    try {
      const [cohortsRes, adminsRes] = await Promise.all([
        fetch('/api/cohorts?mode=management'),
        fetch('/api/admin/list-admins')
      ])
      const cohortsData = await cohortsRes.json()
      const adminsData = await adminsRes.json()
      setCohorts(cohortsData || [])
      setAdmins(adminsData || [])
    } catch (err) {
      console.error('Fetch failed', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function handleAssignAdmin(cohortId: string, adminId: string) {
    setUpdating(cohortId)
    try {
      const res = await fetch('/api/cohorts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cohortId, admin_id: adminId === 'none' ? null : adminId })
      })
      if (res.ok) {
        setCohorts(cohorts.map(c => c.id === cohortId ? { ...c, admin_id: adminId === 'none' ? null : adminId } : c))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  async function handleCreateCohort(e: React.FormEvent) {
    e.preventDefault()
    if (!newCohortName.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/cohorts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCohortName.trim() })
      })
      if (res.ok) {
        setNewCohortName('')
        setIsModalOpen(false)
        fetchData()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto px-10 py-12 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-navy rounded-2xl flex items-center justify-center text-gold shadow-xl shadow-navy/10">
            <LayoutGrid size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-navy tracking-tight leading-none mb-1.5">Cohort Governance</h1>
            <p className="text-sm text-slate font-semibold">System-level management of venture groups and evaluators.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-navy text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-navy/20 flex items-center gap-3"
        >
          <Plus size={16} className="text-gold" />
          Initialise New Cohort
        </button>
      </div>

      {loading ? (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-4 text-slate-300">
          <Loader2 className="animate-spin" size={32} />
          <span className="text-[10px] font-black uppercase tracking-widest">Reconciling System...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cohorts.map((cohort) => (
            <div key={cohort.id} className="bg-white rounded-[32px] border border-rule/60 p-8 shadow-sm hover:shadow-xl hover:shadow-navy/5 transition-all group relative overflow-hidden">
               <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                       <Building2 size={12} className="text-silver" />
                       <span className="text-[10px] font-black text-silver uppercase tracking-widest">Cohort Node</span>
                    </div>
                    <h3 className="text-xl font-black text-navy tracking-tight">{cohort.name}</h3>
                  </div>
                  <button className="w-10 h-10 rounded-xl bg-smoke text-silver flex items-center justify-center hover:bg-navy hover:text-white transition-all">
                    <MoreVertical size={16} />
                  </button>
               </div>

               <div className="space-y-6 relative z-10">
                  <div>
                    <label className="text-[10px] font-black text-slate uppercase tracking-widest block mb-3 pl-1">Primary Evaluator</label>
                    <div className="relative">
                      {updating === cohort.id ? (
                        <div className="w-full bg-smoke/50 rounded-2xl py-4 flex items-center justify-center">
                          <Loader2 className="animate-spin text-navy" size={16} />
                        </div>
                      ) : (
                        <select
                          className="w-full bg-smoke/50 border border-transparent rounded-2xl py-4 px-5 text-xs font-bold text-navy outline-none focus:bg-white focus:border-navy/20 transition-all appearance-none"
                          value={cohort.admin_id || 'none'}
                          onChange={(e) => handleAssignAdmin(cohort.id, e.target.value)}
                        >
                          <option value="none">Unassigned / System Pool</option>
                          {admins.map(admin => (
                            <option key={admin.id} value={admin.id}>{admin.full_name || admin.email}</option>
                          ))}
                        </select>
                      )}
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-silver">
                        <UserPlus size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-smoke">
                     <div className="flex items-center gap-2">
                       <CheckCircle2 size={14} className={cohort.admin_id ? "text-teal" : "text-amber-500"} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate">Status</span>
                     </div>
                     <span className={cn(
                       "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                       cohort.admin_id ? "bg-teal-lt text-teal" : "bg-amber-50 text-amber-600"
                     )}>
                        {cohort.admin_id ? "Evaluator Assigned" : "Awaiting Lead"}
                     </span>
                  </div>
               </div>

               {/* Background Glow */}
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/5 rounded-full blur-3xl" />
            </div>
          ))}
        </div>
      )}

      {/* Initialize Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-navy/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
           <div className="bg-white rounded-[40px] w-full max-w-lg relative z-10 shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-200">
              <div className="p-10 space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-navy text-gold rounded-2xl flex items-center justify-center shadow-lg">
                       <LayoutGrid size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-navy tracking-tight">Create New Cohort</h3>
                       <p className="text-xs text-silver font-semibold">Define a new venture grouping.</p>
                    </div>
                 </div>

                 <form onSubmit={handleCreateCohort} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-navy uppercase tracking-widest pl-1">Cohort Designation</label>
                       <input 
                         autoFocus
                         type="text" 
                         value={newCohortName}
                         onChange={(e) => setNewCohortName(e.target.value)}
                         placeholder="e.g. Innovate 2024 - Batch A"
                         className="w-full bg-smoke border border-rule rounded-2xl py-4 px-6 text-sm font-bold text-navy outline-none focus:border-navy focus:ring-4 focus:ring-navy/5 transition-all"
                       />
                    </div>
                    <div className="flex gap-4">
                       <button 
                         type="button" 
                         onClick={() => setIsModalOpen(false)}
                         className="flex-1 px-8 py-4 bg-smoke text-slate rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rule transition-all"
                       >
                         Cancel
                       </button>
                       <button 
                         type="submit"
                         disabled={loading || !newCohortName.trim()}
                         className="flex-1 px-8 py-4 bg-navy text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-navy/20 flex items-center justify-center gap-2"
                       >
                         {loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                         Create Cohort
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}
