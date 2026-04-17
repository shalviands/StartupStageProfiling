import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createServerSupabaseClient()
    
    // Auth Check: Is admin or programme team?
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin' && profile?.role !== 'programme_team') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { teamId, status } = await request.json()
    if (!teamId || !status) return NextResponse.json({ error: 'Missing data' }, { status: 400 })

    const { error } = await supabase
      .from('teams')
      .update({ submission_status: status })
      .eq('id', teamId)

    if (error) throw error

    return NextResponse.json({ success: true, status })
  } catch (error: any) {
    console.error('[FINALISE_API]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
