'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTeams } from '@/hooks/useTeams'
import { CheckCircle2, FileText, Loader2, Zap } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/utils/cn'

export default function SubmittedPage() {
  const router = useRouter()
  const { data: teams = [], isLoading } = useTeams()
  
  const team = teams[0]

  if (isLoading) return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <Loader2 className="animate-spin" size={24} />
      <span className="text-[10px] font-black uppercase tracking-widest">Verifying Submission...</span>
    </div>
  )

  if (!team || team.submission_status === 'draft') {
    router.push('/startup/profile')
    return null
  }

  const isFinalised = team.submission_status === 'finalised' && team.diagnosis_visible

  return (
    <div className="max-w-xl mx-auto py-12">
      <div className="bg-white rounded-[40px] border border-slate-200 p-12 text-center shadow-xl shadow-slate-200/50">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-8 mx-auto animate-in zoom-in-50 duration-500">
          <CheckCircle2 size={40} />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Profile Submitted!</h1>
        <p className="text-slate-500 font-medium leading-relaxed mb-10">
          Your diagnostic profile has been successfully submitted to the InUnity team. 
          We are currently reviewing your data to prepare your final strategic diagnosis.
        </p>

        <div className="grid gap-3">
          <Link 
            href="/startup/profile" // This will be read-only if I handle it in the component
            className="flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            <FileText size={16} />
            View Your Submission
          </Link>

          <Link 
            href="/startup/diagnosis"
            className={cn(
              "flex items-center justify-center gap-3 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border",
              isFinalised 
                ? "bg-amber-500 text-white border-amber-600 hover:bg-amber-600 shadow-lg shadow-amber-100" 
                : "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed opacity-60"
            )}
            onClick={(e) => !isFinalised && e.preventDefault()}
          >
            <Zap size={16} />
            {isFinalised ? 'Check Your Diagnosis' : 'Diagnosis In Progress'}
          </Link>
        </div>

        {!isFinalised && (
          <p className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Check back soon for your strategic roadmap
          </p>
        )}
      </div>
    </div>
  )
}
