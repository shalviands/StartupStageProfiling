import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { mapDbToFrontend, mapFrontendToDb } from '@/utils/mappers'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use anon client only for the profiles table (respects RLS correctly)
    const supabase = await createServerSupabaseClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role

    // Use admin client for teams table to bypass RLS restrictions.
    // Ownership is enforced in application code below.
    const { data: targetTeam, error } = await supabaseAdmin
      .from('teams')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !targetTeam) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // Application-level ownership check
    if (role !== 'admin' && role !== 'programme_team') {
      if (targetTeam.startup_user_id !== user.id && targetTeam.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    return NextResponse.json(targetTeam)
  } catch (error: any) {
    console.error(`[TEAM_GET_${params.id}]`, error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

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
    // Use anon client only for the profiles table (respects RLS correctly)
    const supabase = await createServerSupabaseClient()

    // 1. Fetch user role from profiles (anon client is fine here)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role

    // 2. Fetch target team via admin client to bypass RLS.
    // Ownership is validated in application code below.
    const { data: targetTeam, error: fetchError } = await supabaseAdmin
      .from('teams')
      .select('startup_user_id, user_id, submission_status')
      .eq('id', params.id)
      .single()

    if (fetchError || !targetTeam) {
      console.error(`[TEAM_PUT_${params.id}] Team not found:`, fetchError?.message)
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // 3. Application-level ownership / role check
    if (role !== 'admin') {
      if (role === 'startup') {
        if (targetTeam.startup_user_id !== user.id && targetTeam.user_id !== user.id) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
      }
      // Programme team members can update any team.
    }

    // Protection against client-side injection of locked attributes
    if (role !== 'admin' && role !== 'programme_team') {
      delete body.submission_status
      delete body.diagnosis_released
    }

    const dbData = mapFrontendToDb(body)

    // 4. Perform the update via admin client to bypass RLS on writes
    const { data, error } = await supabaseAdmin
      .from('teams')
      .update(dbData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error(`[TEAM_PUT_${params.id}] Update error:`, error.message)
      throw error
    }

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

    // Use anon client only for the profiles table (respects RLS correctly)
    const supabase = await createServerSupabaseClient()

    // 1. Fetch user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role

    // 2. Application-level ownership check via admin client
    if (role !== 'admin') {
      const { data: targetTeam } = await supabaseAdmin
        .from('teams')
        .select('startup_user_id, user_id')
        .eq('id', params.id)
        .single()

      if (!targetTeam) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      
      if (role === 'startup') {
        if (targetTeam.startup_user_id !== user.id && targetTeam.user_id !== user.id) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
      } else {
        if (targetTeam.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // 3. Perform delete via admin client to bypass RLS
    const { error } = await supabaseAdmin
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
