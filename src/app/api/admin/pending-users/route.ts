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

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

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
    if (!managedCohortIds.includes(cohortId)) {
      return NextResponse.json({ error: 'Forbidden: You do not manage this cohort' }, { status: 403 })
    }
    targetCohortIds = [cohortId]
  }

  if (targetCohortIds.length === 0) {
    return NextResponse.json([]) // No assigned cohorts, no pending users
  }

  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('status', 'pending')
    .in('requested_cohort_id', targetCohortIds) // Only users requesting my cohorts
    .neq('role', 'admin') 
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(users)
}
