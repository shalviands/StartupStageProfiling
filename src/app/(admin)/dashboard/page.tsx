import React from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { calculateOverallScore } from '@/utils/scores'
import { 
  Users, 
  Clock, 
  FileCheck, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  Target
} from 'lucide-react'
import { cn } from '@/utils/cn'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient()

  // Fetch all necessary stats
  const { count: totalStartups } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'startup')
  const { count: pendingApprovals } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'startup').eq('status', 'pending')
  const { data: teams } = await supabase.from('teams').select('*')
  
  const submittedCount = teams?.filter(t => t.submission_status === 'submitted').length || 0
  const finalisedCount = teams?.filter(t => t.submission_status === 'finalised').length || 0
  
  const overallScores = teams?.map(t => calculateOverallScore(t).overall) || []
  const avgOverall = overallScores.length > 0 ? (overallScores.reduce((a, b) => a + b, 0) / overallScores.length).toFixed(1) : '0.0'
  const needingAttention = teams?.filter(t => calculateOverallScore(t).overall < 2.0).length || 0

  // Stage Distribution
  const stages = ['IDEA', 'PSF', 'VALIDATION', 'MVP', 'REVENUE', 'GROWTH']
  const stageCounts = stages.map(s => teams?.filter(t => t.detected_stage?.includes(s)).length || 0)
  const maxStageCount = Math.max(...stageCounts, 1)

  const STATS = [
    { label: 'Total Startups', val: totalStartups || 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Pending Approval', val: pendingApprovals || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Submitted Forms', val: submittedCount, icon: FileCheck, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Finalised Diagnosis', val: finalisedCount, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Avg Overall Score', val: avgOverall, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Need Attention', val: needingAttention, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ]

  return (
    <div className="p-10 space-y-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 font-medium tracking-tight">InUnity Intelligence — Diagnostic Performance Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              Refresh Data
           </button>
           <button className="px-5 py-2.5 bg-[#0F172A] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-black/10">
              Download Summary
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {STATS.map((s, i) => (
          <div key={i} className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm hover:translate-y-[-4px] transition-all duration-300">
             <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform", s.bg, s.color)}>
               <s.icon size={22} />
             </div>
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</div>
             <div className="text-2xl font-black text-slate-900">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stage Distribution */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                 <Target size={20} />
              </div>
              <h3 className="font-black text-slate-900 tracking-tight">Venture Stage Distribution</h3>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Benchmarks</span>
          </div>

          <div className="space-y-6">
            {stages.map((st, i) => {
              const count = stageCounts[i]
              const percent = (count / (teams?.length || 1)) * 100
              const barPercent = (count / maxStageCount) * 100

              return (
                <div key={st} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">{st}</span>
                    <span className="text-slate-900">{count} Startups</span>
                  </div>
                  <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-1000 delay-100",
                        i === 0 ? "bg-slate-300" : i === 1 ? "bg-amber-300" : i === 2 ? "bg-amber-500" : i === 3 ? "bg-emerald-400" : i === 4 ? "bg-emerald-600" : "bg-indigo-600"
                      )}
                      style={{ width: `${barPercent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions / Recent Activity */}
        <div className="space-y-8">
           <div className="bg-[#0F172A] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[80px]" />
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-amber-500">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-black tracking-tight leading-tight mb-2">Diagnostic Engine Active</h4>
                  <p className="text-indigo-200 text-xs font-medium leading-relaxed">System is successfully reconciling diagnostic reports for the current cohort.</p>
                </div>
                <Link 
                  href="/admin/approvals"
                  className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all group"
                >
                  Review Pending Approvals
                  <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
           </div>

           <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
               <ShieldCheck size={18} className="text-emerald-500" />
               <h3 className="font-black text-slate-900 tracking-tight">Performance Summary</h3>
             </div>
             <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                   <div className="text-[10px] font-black text-slate-500 uppercase">Avg Problem Score</div>
                   <div className="text-sm font-black text-slate-900">4.2</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                   <div className="text-[10px] font-black text-slate-500 uppercase">Avg Moat Score</div>
                   <div className="text-sm font-black text-slate-900">2.1</div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
