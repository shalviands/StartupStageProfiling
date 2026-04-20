// src/app/api/programme/release-diagnosis/route.ts
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createServerSupabaseClient()
    
    // Check if user is Programme Team or Admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['programme_team', 'admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
    }

    const { teamId, release } = await request.json()
    if (!teamId) return NextResponse.json({ error: 'Missing teamId' }, { status: 400 })

    // Update the team record
    // Note: Do not mutate submission_status arbitrarily to 'verified' to prevent constraint failure.
    // The UI handles 'diagnosis_released = true' as 'verified' visually.
    const { error } = await supabaseAdmin
      .from('teams')
      .update({ 
        diagnosis_released: !!release 
      })
      .eq('id', teamId)

    if (error) throw error

    return NextResponse.json({ success: true, released: !!release })
  } catch (err: any) {
    console.error('[API] Release Diagnosis Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
