import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  // 1. Check Admin Permission
  const { searchParams } = new URL(req.url)
  const cohortId = searchParams.get('cohortId')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'programme_team') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const isProgrammeTeam = true // Always true now for this endpoint

  // 2. Fetch Pending Users for Admin's Cohorts
  // First, get cohorts managed by this admin
  const { data: adminCohorts } = await supabase
    .from('cohorts')
    .select('id')
    .eq('admin_id', user.id)
  
  const managedCohortIds = adminCohorts?.map(c => c.id) || []

  // If a specific cohort was requested, verify the admin manages it
  let targetCohortIds = managedCohortIds
  if (cohortId) {
    if (!isProgrammeTeam && !managedCohortIds.includes(cohortId)) {
      return NextResponse.json({ error: 'Forbidden: You do not manage this cohort' }, { status: 403 })
    }
    targetCohortIds = [cohortId]
  }

  if (!isProgrammeTeam && targetCohortIds.length === 0) {
    return NextResponse.json([]) // No assigned cohorts, no pending users
  }

  let query = supabase
    .from('profiles')
    .select('*, requested_cohort:cohorts(name)')
    .eq('status', 'pending')
    .neq('role', 'admin') 

  if (!isProgrammeTeam) {
    query = query.in('requested_cohort_id', targetCohortIds)
  } else if (cohortId) {
    query = query.eq('requested_cohort_id', cohortId)
  }

  const { data: users, error } = await query.order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(users)
}
