import { redirect } from 'next/navigation'
import { getUserProfile } from '@/lib/roles'
import StartupHeaderActions from '@/components/startup/StartupHeaderActions'

export default async function StartupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getUserProfile()
  if (!profile || profile.role !== 'startup') redirect('/login')
  if (profile.status !== 'approved') redirect('/pending')

  return (
    <div style={{
      minHeight: '100vh', background: '#F4F6F9',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Startup top bar — simple, no sidebar */}
      <header style={{
        background: '#0F2647', padding: '12px 24px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: '#E8A020',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 12, color: '#0F2647',
          }}>IU</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, lineHeight: '14px' }}>
              Startup Stage Profiler
            </div>
            <div style={{ color: '#8A9BB0', fontSize: 10, marginTop: 2 }}>
              InUnity Private Limited
            </div>
          </div>
        </div>
        <StartupHeaderActions profile={profile} />
      </header>
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 20px' }}>
        {children}
      </main>
    </div>
  )
}
