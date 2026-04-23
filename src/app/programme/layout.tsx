import { redirect } from 'next/navigation'
import { getUserProfile } from '@/lib/roles'
import ProgrammeSidebar from '@/components/programme/ProgrammeSidebar'
import ProgrammeTopBar from '@/components/programme/ProgrammeTopBar'

export default async function ProgrammeLayout({
  children,
}: { children: React.ReactNode }) {
  const profile = await getUserProfile()
  if (!profile) redirect('/login')
  
  if (profile.role === 'startup') redirect('/startup/profiler')
  
  if (!['programme_team', 'admin'].includes(profile.role)) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-smoke">
      <ProgrammeSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <ProgrammeTopBar profile={profile} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
