'use client'

import React from 'react'
import { useTeams } from '@/hooks/useTeams'
import StatCards from '@/components/dashboard/StatCards'
import TeamsTable from '@/components/dashboard/TeamsTable'
import { Plus, LayoutDashboard, Database, Zap } from 'lucide-react'

export default function ProgrammeDashboard() {
  const { data: teams = [], isLoading } = useTeams()

  // Derived Stats
  const stats = {
    totalTeams: teams.length,
    avgScore: teams.length > 0 
      ? teams.reduce((acc, t) => acc + (t.overall_weighted_score || 0), 0) / teams.length 
      : 0,
    pendingApprovals: teams.filter(t => t.submission_status === 'submitted').length,
    growthRate: '88%' // Placeholder for conversion rate
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-10 pb-32 animate-in fade-in duration-700">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-silver mb-2">
            <LayoutDashboard size={14} className="text-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Oversight</span>
          </div>
          <h1 className="text-4xl font-black text-navy tracking-tight leading-none mb-2">Venture Portfolio</h1>
          <p className="text-sm text-slate font-semibold max-w-xl">
            Real-time diagnostic metrics across your cohort of {teams.length} startups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-8 mr-8 bg-white px-8 py-4 rounded-3xl border border-rule shadow-sm">
             <div className="text-center group">
               <p className="text-[9px] font-black text-silver uppercase tracking-widest mb-1 group-hover:text-gold transition-colors">Integrity</p>
               <p className="text-xs font-black text-navy uppercase tracking-tighter">Verified</p>
             </div>
             <div className="w-px h-8 bg-rule" />
             <div className="text-center group">
               <p className="text-[9px] font-black text-silver uppercase tracking-widest mb-1 group-hover:text-gold transition-colors">Sync Status</p>
               <div className="flex items-center gap-1.5 justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                  <p className="text-xs font-black text-navy uppercase tracking-tighter">Live</p>
               </div>
             </div>
          </div>
          <button className="bg-navy text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-navy/20 hover:opacity-90 active:scale-95 transition-all flex items-center gap-3">
            <Plus size={16} className="text-gold" /> Add Enterprise Venture
          </button>
        </div>
      </div>

      {/* Metrics Section */}
      <StatCards stats={stats} />

      {/* Main Table Interface */}
      <div className="space-y-6 mt-12">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-xl bg-gold-lt flex items-center justify-center text-gold">
            <Database size={16} />
          </div>
          <h2 className="text-lg font-black text-navy tracking-tight">Venture Database</h2>
          <div className="bg-smoke px-3 py-1 rounded-full border border-rule text-[10px] font-black text-silver uppercase tracking-widest">
            {teams.length} Records
          </div>
        </div>
        
        <TeamsTable teams={teams} isLoading={isLoading} />
      </div>

      {/* Quick Insights Banner */}
      <div className="mt-16 bg-navy rounded-[40px] p-12 text-white relative overflow-hidden group shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="max-w-xl space-y-4">
               <div className="bg-gold text-navy text-[9px] font-black px-3 py-1 rounded-full inline-block uppercase tracking-widest">System Intelligence</div>
               <h3 className="text-3xl font-black tracking-tight leading-tight">Advanced Stage Detection is active for all ventures.</h3>
               <p className="text-white/60 font-medium text-sm leading-relaxed">
                 Our 9-parameter engine automatically classifies ventures into stages (Idea to Growth) based on evidence patterns. Deep-dive analytics are automatically enabled for validated startups.
               </p>
            </div>
            <button className="bg-white text-navy px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-navy transition-all shadow-xl shadow-white/5 active:scale-95 flex items-center gap-3 self-start lg:self-center">
              <Zap size={16} fill="currentColor" /> Generate Cohort Synthesis
            </button>
         </div>
      </div>
    </div>
  )
}
