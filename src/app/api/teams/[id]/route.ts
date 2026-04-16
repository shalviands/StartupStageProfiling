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
    
    const dbData = mapFrontendToDb(body)

    const { data, error } = await supabase
      .from('teams')
      .update(dbData)
      .eq('id', params.id)
      .eq('user_id', user.id) // Security: Ensure user owns the record
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
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`[TEAM_DELETE_${params.id}]`, error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
