import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient()

  // 1. Check Admin Permission
  const user = await getUserFromRequest()
  if (!user) {
    console.error('[Approve API] Auth failure: no user found')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (adminProfile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 2. Perform Toggle
  const { userId, status, role } = await req.json()

  if (!userId || !['pending', 'approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const updateData: any = { status }
  if (role) updateData.role = role

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)

  if (error) {
    console.error('[Approve API] Database error during update:', error.message, error.details)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, status, role: role || 'unchanged' })
}
