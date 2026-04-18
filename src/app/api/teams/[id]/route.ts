import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import { mapDbToFrontend, mapFrontendToDb } from '@/utils/mappers'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const supabase = await createServerSupabaseClient()

    // 1. Fetch user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role

    // 2. Fetch target team to check ownership
    const { data: targetTeam, error: fetchError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', params.id)
      .single()

    if (fetchError || !targetTeam) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // 3. Security: Role-based check
    if (role !== 'admin') {
      if (role === 'startup') {
        if (targetTeam.startup_user_id !== user.id) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
      } 
      // Programme team members can update any team.
      // Detailed permission enforcement (e.g. they can only update if assigned)
      // is handled via Supabase Row-Level Security where needed.
    }

    const dbData = mapFrontendToDb(body)

    const { data, error } = await supabase
      .from('teams')
      .update(dbData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error(`[TEAM_PUT_${params.id}]`, error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()

    // 1. Fetch user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role

    // 2. Check ownership if not admin
    if (role !== 'admin') {
       const { data: targetTeam } = await supabase
        .from('teams')
        .select('*')
        .eq('id', params.id)
        .single()

      if (!targetTeam) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      
      if (role === 'startup') {
        if (targetTeam.startup_user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      } else {
        if (targetTeam.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`[TEAM_DELETE_${params.id}]`, error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
