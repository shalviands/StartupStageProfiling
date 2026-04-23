'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  Rocket, 
  MessageSquare,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/utils/cn'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/programme/dashboard', icon: BarChart3 },
  { label: 'All Submissions', href: '/programme/startups', icon: Rocket },
]

export default function ProgrammeSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[280px] bg-[#0F2647] flex flex-col h-full border-r border-white/5">
      {/* Brand */}
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8A020] flex items-center justify-center font-black text-[#0F2647] shadow-xl shadow-amber-500/10">
            IU
          </div>
          <div>
            <div className="text-white font-black text-sm tracking-tight leading-tight">InUnity Programme</div>
            <div className="text-[#8A9BB0] text-[10px] font-bold uppercase tracking-widest mt-1">Evaluator Portal</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 py-8 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group border-l-4",
                isActive 
                  ? "bg-white/10 text-white border-[#E8A020] shadow-lg shadow-black/20" 
                  : "text-white/70 border-transparent hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={cn(isActive ? "text-[#E8A020]" : "text-[#8A9BB0]/50 group-hover:text-[#8A9BB0]")} />
                <span className="text-[13px] font-black tracking-tight">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} className="text-[#E8A020]" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer Branding */}
      <div className="p-8 border-t border-white/5 opacity-30">
        <div className="text-[10px] font-black text-[#8A9BB0] uppercase tracking-[0.3em]">
          Platform Version v 0.04
        </div>
      </div>
    </aside>
  )
}
