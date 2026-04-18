import React from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import RecentSubmissionsTable from '@/components/programme/RecentSubmissionsTable'
import { mapDbToFrontend } from '@/utils/mappers'

export default async function ProgrammeDashboard() {
  const user = await getUserFromRequest()
  const supabase = await createServerSupabaseClient()
  
  // Fetch stats for dashboard
  const { data: dbTeams } = await supabase
    .from('teams')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Raw DB field calc
  const stats = {
    total: dbTeams?.length || 0,
    released: dbTeams?.filter(t => !!t.diagnosis_released).length || 0,
    thisWeek: dbTeams?.filter(t => t.created_at && new Date(t.created_at) > oneWeekAgo).length || 0,
    avgScore: dbTeams && dbTeams.length > 0 
      ? dbTeams.reduce((acc, t) => acc + (Number(t.overall_weighted_score) || 0), 0) / dbTeams.length 
      : 0,
    needReview: dbTeams?.filter(t => !t.diagnosis_released && t.submission_status === 'submitted').length || 0
  }

  const mappedTeams = (dbTeams || []).map(mapDbToFrontend).filter(t => t !== null)

  return (
    <div className="p-8 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight mb-2">Cohort Dashboard</h1>
          <p className="text-slate font-bold uppercase text-[10px] tracking-widest opacity-60">Programme Performance & Insights</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Submissions', value: stats.total, color: 'navy' },
          { label: 'This Week', value: stats.thisWeek, color: 'teal' },
          { label: 'Avg Score', value: stats.avgScore.toFixed(1), color: 'gold' },
          { label: 'Need Review', value: stats.needReview, color: 'coral' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-rule shadow-sm">
            <p className="text-[9px] font-black uppercase tracking-widest text-silver mb-2">{stat.label}</p>
            <p className={`text-4xl font-black text-${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-rule shadow-sm min-h-[400px]">
            <h2 className="text-lg font-black text-navy mb-6 tracking-tight">Recent Submissions</h2>
            <RecentSubmissionsTable teams={mappedTeams.slice(0, 5) as any} />
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="bg-navy p-8 rounded-[40px] shadow-xl shadow-navy/20 min-h-[400px] text-white">
            <h2 className="text-lg font-black mb-6 tracking-tight">AI Cohort Insights</h2>
            <p className="text-silver text-[10px] font-black uppercase tracking-widest mb-4">Strategic Overview</p>
             <div className="space-y-4 opacity-70 text-sm font-medium">
               Waiting for analysis results...
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
