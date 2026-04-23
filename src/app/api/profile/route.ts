import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createServerSupabaseClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  // Security: Strip internal assignment metadata for startups
  if (profile.role === 'startup') {
    const { cohort_id, requested_cohort_id, ...safeProfile } = profile
    return NextResponse.json(safeProfile)
  }

  return NextResponse.json(profile)
}
