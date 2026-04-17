import { redirect } from 'next/navigation'
import { getUserProfile } from '@/lib/roles'
import { getHomeRouteForRole } from '@/utils/navigation'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function RootPage() {
  const profile = await getUserProfile()
  if (profile) {
    redirect(getHomeRouteForRole(profile.role, profile.status))
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-[#F59E0B]/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center font-bold text-[#F59E0B] shadow-lg shadow-navy-900/20">
              IU
            </div>
            <div>
              <div className="font-extrabold text-[#0F172A] leading-none tracking-tight">InUnity</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Founders Lab</div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <a href="#features" className="text-slate-700 hover:text-[#0F172A] transition-colors">Features</a>
            <a href="#about" className="text-slate-700 hover:text-[#0F172A] transition-colors">Methodology</a>
            <div className="flex items-center gap-4 border-l border-slate-200 pl-8">
              <Link 
                href="/login" 
                className="text-[#0F172A] hover:opacity-70 transition-all font-bold"
              >
                Log In
              </Link>
              <Link 
                href="/register" 
                className="px-6 py-2.5 border-2 border-[#0F172A] text-[#0F172A] rounded-full hover:bg-slate-50 transition-all font-bold active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-40 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-section-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#92400E] text-[11px] font-bold uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                Venture Strategy Engine
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-[#0F172A] leading-[1.1] tracking-tight mb-8">
                Accelerate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F172A] to-[#475569]">Venture DNA</span>
              </h1>
              <p className="text-lg text-slate-700 leading-relaxed mb-10 max-w-lg font-medium">
                The high-performance profiling framework used by InUnity founders and programme teams to benchmark readiness, identify bottlenecks, and unlock growth.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/login" 
                  className="px-8 py-4 bg-[#0F172A] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-2xl shadow-navy-900/20 group active:scale-[0.98]"
                >
                  Member Login
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link 
                  href="/register" 
                  className="px-8 py-4 bg-white text-[#0F172A] border-2 border-[#0F172A] rounded-2xl font-extrabold flex items-center justify-center hover:bg-slate-50 transition-all active:scale-[0.98]"
                >
                  Sign Up as Startup
                </Link>
              </div>
            </div>

            <div className="relative animate-section-in delay-200">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F59E0B]/20 to-transparent rounded-full blur-3xl opacity-30" />
              <div className="relative glass-card premium-shadow rounded-[32px] p-2 overflow-hidden border-2 border-white/50">
                <Image 
                  src="/hero_diagnostic_illustration_1776344892364.png"
                  alt="Startup Profiling Illustration"
                  width={600}
                  height={600}
                  className="rounded-[28px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white relative border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-[#0F172A] mb-4">The InUnity Ecosystem</h2>
              <p className="text-slate-500 font-medium">Built for rapid iteration and evidence-based decision making.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: '9-Parameter Framework',
                  desc: 'Deep-dive into Problem Clarity, Moats, and CRL with research-backed profiling tools.',
                  icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                },
                {
                  title: 'AI Synthesis',
                  desc: 'Proprietary models analyze your team metrics to provide real-time strategic recommendations.',
                  icon: 'M13 10V3L4 14h7v7l9-11h-7z'
                },
                {
                  title: 'Professional Reports',
                  desc: 'Export high-fidelity PDF and Excel audit trails for stakeholders and program directors.',
                  icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
                }
              ].map((f, i) => (
                <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-[#F59E0B]/30 hover:bg-white hover:shadow-2xl transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#0F172A] mb-6 shadow-sm group-hover:bg-[#0F172A] group-hover:text-white transition-all">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0F172A] mb-3">{f.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="relative rounded-[40px] bg-[#0F172A] p-12 md:p-20 overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to Profile?</h2>
                <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto font-medium">
                  Join the cohort of data-driven founders scaling with the InUnity Startup Stage Profiler platform.
                </p>
                <Link 
                  href="/login" 
                  className="inline-flex px-10 py-5 bg-[#F59E0B] text-[#0F172A] rounded-2xl font-black text-lg hover:bg-[#D97706] transition-all shadow-2xl shadow-orange-500/20 active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center font-bold text-[#F59E0B] text-xs">IU</div>
            <span className="font-bold text-[#0F172A] text-sm">InUnity Portal</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">© 2024 InUnity Programme. All Rights Reserved.</p>
          <div className="flex items-center gap-6 text-sm font-bold text-slate-500">
            <a href="#" className="hover:text-[#0F172A]">Privacy</a>
            <a href="#" className="hover:text-[#0F172A]">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
