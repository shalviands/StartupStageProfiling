import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { cohortId } = await req.json()
    if (!cohortId) return NextResponse.json({ error: 'Cohort ID is required' }, { status: 400 })

    const supabase = await createServerSupabaseClient()
    
    // Check current status
    const { data: profile } = await supabase
      .from('profiles')
      .select('status')
      .eq('id', user.id)
      .single()

    if (profile?.status !== 'rejected') {
       return NextResponse.json({ error: 'Only rejected applications can re-apply' }, { status: 400 })
    }

    // Update status to pending and set new requested cohort
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        status: 'pending',
        requested_cohort_id: cohortId,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[REAPPLY_API]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
