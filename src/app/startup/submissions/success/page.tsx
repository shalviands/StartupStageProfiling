// src/app/startup/submissions/success/page.tsx
'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, List, PlusCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function SubmissionSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subNumber = searchParams.get('number') || '1'

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="w-24 h-24 bg-teal-lt text-teal rounded-[40px] flex items-center justify-center mb-10 shadow-inner">
        <CheckCircle2 size={48} strokeWidth={2.5} />
      </div>

      <div className="space-y-4 mb-12">
        <h1 className="text-4xl font-black text-navy tracking-tight leading-none">
          Submission Success
        </h1>
        <p className="text-xl font-medium text-slate max-w-lg mx-auto leading-relaxed">
          Your Strategic Profile <span className="text-navy font-black">#{subNumber}</span> has been locked and submitted for review.
        </p>
        <div className="text-[10px] font-black text-silver uppercase tracking-[0.3em] pt-4">
          RECORDED {new Date().toLocaleDateString('en-GB')}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <Link 
          href="/startup/submissions"
          className="px-10 py-5 bg-white border border-rule text-navy rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-smoke transition-all shadow-sm flex items-center gap-3 active:scale-95"
        >
          <List size={16} /> View All Submissions
        </Link>
        <Link 
          href="/startup/profiler"
          className="px-10 py-5 bg-navy text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-navy/20 flex items-center gap-3 active:scale-95 group"
        >
          <PlusCircle size={16} className="text-gold" /> 
          <span>Start New Profile</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="mt-20 max-w-md p-8 bg-gold-lt rounded-[32px] border border-gold/10 text-left">
          <h4 className="text-xs font-black text-navy uppercase tracking-widest mb-3">Next Steps</h4>
          <p className="text-sm text-slate leading-relaxed font-semibold">
            The InUnity programme team will now evaluate your data. You will be notified once your 
            Personal Roadmap is ready for viewing.
          </p>
      </div>
    </div>
  )
}
