import { redirect } from 'next/navigation'
import { getUserProfile } from '@/lib/roles'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'

export default async function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  const profile = await getUserProfile()
  if (!profile || profile.role !== 'admin') redirect('/login')

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AdminTopBar profile={profile} />
        <main style={{ flex: 1, overflowY: 'auto', background: '#F4F6F9' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
