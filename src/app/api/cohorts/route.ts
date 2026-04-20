import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import { supabaseAdmin } from '@/lib/supabase/admin'

// GET /api/cohorts
// Public: List basic cohort data (id, name) for registration
// Private (Super Admin/Admin): List full details
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const mode = searchParams.get('mode') // 'public' | 'management'
    
    const user = await getUserFromRequest()
    const supabase = await createServerSupabaseClient()
    
    // For registration, we only need name and id
    if (mode === 'public') {
      const { data, error } = await supabaseAdmin
        .from('cohorts')
        .select('id, name')
        .order('name')
      
      if (error) throw error
      return NextResponse.json(data)
    }

    // Management mode requires authentication
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()

    if (profile?.role === 'programme_team') {
       // Super Admin sees everything
       const { data, error } = await supabaseAdmin
         .from('cohorts')
         .select(`
           *,
           admin:profiles!cohorts_admin_id_fkey(id, full_name, email)
         `)
         .order('created_at', { ascending: false })
       
       if (error) throw error
       return NextResponse.json(data)
    }

    if (profile?.role === 'admin') {
       // Admins only see cohorts assigned to them
       const { data, error } = await supabaseAdmin
         .from('cohorts')
         .select('*')
         .eq('admin_id', user.id)
         .order('name')
       
       if (error) throw error
       return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  } catch (error: any) {
    console.error('[COHORTS_GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/cohorts (Super Admin only)
export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createServerSupabaseClient()
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()

    if (profile?.role !== 'programme_team') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { name, admin_id } = await req.json()
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('cohorts')
      .insert({ name, admin_id })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[COHORTS_POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/cohorts (Super Admin only) - Update Admin assignment
export async function PATCH(req: Request) {
  try {
    const user = await getUserFromRequest()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createServerSupabaseClient()
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()

    if (profile?.role !== 'programme_team') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id, admin_id, name } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('cohorts')
      .update({ admin_id, name, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[COHORTS_PATCH]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
