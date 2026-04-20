import React from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
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
  Target,
  LayoutGrid
} from 'lucide-react'
import { cn } from '@/utils/cn'
import Link from 'next/link'
import UserApprovals from '@/components/admin/UserApprovals'
import CohortInsights from '@/components/admin/CohortInsights'

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient()

  // Fetch all necessary stats
  const { count: totalStartups } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'startup')
  const { count: pendingApprovals } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'startup').eq('status', 'pending')
  const { data: teams } = await supabaseAdmin.from('teams').select('*')
  
  const submittedCount = teams?.filter(t => t.submission_status === 'submitted').length || 0
  const releasedCount = teams?.filter(t => t.diagnosis_released).length || 0
  
  const overallScores = teams?.map(t => calculateOverallScore(t).overall) || []
  const avgOverall = overallScores.length > 0 ? (overallScores.reduce((a, b) => a + b, 0) / overallScores.length).toFixed(1) : '0.0'
  const needingAttention = teams?.filter(t => calculateOverallScore(t).overall < 2.0).length || 0
  
  // Stage Distribution
  const stages = ['IDEA', 'PSF', 'VALIDATION', 'MVP', 'REVENUE', 'GROWTH']
  const stageCounts = stages.map(s => teams?.filter(t => t.detected_stage?.includes(s)).length || 0)
  const maxStageCount = Math.max(...stageCounts, 1)

  const STATS = [
    { label: 'Total ventures', val: totalStartups || 0, icon: Users, color: 'text-navy', bg: 'bg-smoke' },
    { label: 'Pending Access', val: pendingApprovals || 0, icon: ShieldCheck, color: 'text-gold', bg: 'bg-gold-lt' },
    { label: 'Submitted forms', val: submittedCount, icon: FileCheck, color: 'text-teal', bg: 'bg-teal-lt' },
    { label: 'Released Diagnosis', val: releasedCount, icon: CheckCircle2, color: 'text-teal', bg: 'bg-teal-lt' },
    { label: 'Avg Peer Score', val: avgOverall, icon: TrendingUp, color: 'text-purple', bg: 'bg-purple-lt' },
    { label: 'At Risk', val: needingAttention, icon: AlertTriangle, color: 'text-coral', bg: 'bg-coral-lt' },
  ]

  return (
    <div className="max-w-[1600px] mx-auto px-10 py-12 space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 text-silver mb-2">
            <ShieldCheck size={14} className="text-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Administrator Oversight</span>
          </div>
          <h1 className="text-4xl font-black text-navy tracking-tight leading-none mb-1">System Intelligence</h1>
          <p className="text-sm text-slate font-semibold">Profiler performance and cohort integrity monitoring.</p>
        </div>
        <div className="flex items-center gap-4">
           <a 
             href="/api/admin/export"
             className="px-6 py-3.5 bg-navy text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-navy/20 active:scale-95 flex items-center gap-3"
           >
              <FileCheck size={16} className="text-gold" />
              Download Portfolio (Excel)
           </a>
        </div>
      </div>

      {/* AI Strategic Insights */}
      <CohortInsights />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {STATS.map((s, i) => (
          <div key={i} className="bg-white rounded-[32px] p-8 border border-rule shadow-sm hover:shadow-xl hover:shadow-navy/5 transition-all duration-300 group">
             <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-sm", s.bg, s.color)}>
               <s.icon size={26} />
             </div>
             <div className="text-[10px] font-black text-silver uppercase tracking-widest mb-1.5">{s.label}</div>
             <div className="text-3xl font-black text-navy tracking-tight tabular-nums">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Registration Approval Pipeline */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 bg-gold-lt text-gold rounded-2xl flex items-center justify-center">
                 <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-navy tracking-tight">Access Registry</h3>
                <p className="text-[10px] text-silver font-black uppercase tracking-widest">Pending Onboarding Requests</p>
              </div>
           </div>
           
           <UserApprovals />

           {/* Stage Distribution (Moved below approvals or side-by-side) */}
           <div className="bg-white rounded-[40px] border border-rule p-10 shadow-sm mt-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-smoke text-navy rounded-2xl flex items-center justify-center">
                     <Target size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-navy tracking-tight">Cohort Distribution</h3>
                    <p className="text-[10px] text-silver font-black uppercase tracking-widest leading-none mt-0.5">Automated Venture Classification</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-smoke px-4 py-2 rounded-full border border-rule">
                   <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                   <span className="text-[9px] font-black text-navy uppercase tracking-widest">Live Benchmarking</span>
                </div>
              </div>

              <div className="space-y-8">
                {stages.map((st, i) => {
                  const count = stageCounts[i]
                  const barPercent = (count / maxStageCount) * 100

                  return (
                    <div key={st} className="space-y-3">
                      <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate">{st}</span>
                        <div className="flex items-center gap-3">
                           <span className="text-silver">{((count / (teams?.length || 1)) * 100).toFixed(0)}%</span>
                           <span className="text-navy text-xs">{count} Ventures</span>
                        </div>
                      </div>
                      <div className="h-4 w-full bg-smoke rounded-full overflow-hidden border border-rule p-1">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000 delay-100 shadow-sm",
                            i === 0 ? "bg-silver" : i === 1 ? "bg-gold" : i === 2 ? "bg-gold" : i === 3 ? "bg-teal" : i === 4 ? "bg-teal" : "bg-navy"
                          )}
                          style={{ width: `${barPercent}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
           </div>
        </div>

        {/* System & Analytics */}
        <div className="space-y-10">
           <div className="bg-navy rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10 space-y-8">
                <div className="w-14 h-14 bg-white/10 rounded-3xl flex items-center justify-center text-gold shadow-inner">
                  <Zap size={28} fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-2xl font-black tracking-tight leading-tight mb-2">Analytic Engine Active</h4>
                  <p className="text-white/60 text-xs font-semibold leading-relaxed">System is verified and currently reconciling profiling patterns for {totalStartups} startup nodes.</p>
                </div>
                <Link 
                  href="/admin/startups"
                  className="inline-flex items-center gap-3 bg-white text-navy px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gold transition-all group shadow-xl shadow-black/20 active:scale-95"
                >
                  View Startup Portfolio
                  <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
           </div>

           <div className="bg-white rounded-[40px] border border-rule p-10 shadow-sm">
             <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-teal-lt text-teal rounded-2xl flex items-center justify-center">
                 <ShieldCheck size={20} />
               </div>
               <div>
                 <h3 className="font-black text-navy tracking-tight">Node Integrity</h3>
                 <p className="text-[10px] text-silver font-black uppercase tracking-widest">Global Parameter Averages</p>
               </div>
             </div>
             <div className="space-y-4">
                <div className="p-5 bg-smoke rounded-2xl border border-rule flex items-center justify-between group hover:bg-white hover:border-navy transition-all">
                   <div className="text-[10px] font-black text-slate uppercase tracking-widest">Avg Character Score</div>
                   <div className="text-base font-black text-navy">4.2</div>
                </div>
                <div className="p-5 bg-smoke rounded-2xl border border-rule flex items-center justify-between group hover:bg-white hover:border-navy transition-all">
                   <div className="text-[10px] font-black text-slate uppercase tracking-widest">Avg Moat Strength</div>
                   <div className="text-base font-black text-navy">2.1</div>
                </div>
                <div className="p-5 bg-smoke rounded-2xl border border-rule flex items-center justify-between group hover:bg-white hover:border-navy transition-all">
                   <div className="text-[10px] font-black text-slate uppercase tracking-widest">Sync Compliance</div>
                   <div className="text-base font-black text-teal">100%</div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
