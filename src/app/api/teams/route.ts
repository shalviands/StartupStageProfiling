import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import { TeamBaseSchema } from '@/types/team.types'
import { mapDbToFrontend, mapFrontendToDb } from '@/utils/mappers'

export async function GET() {
  try {
    const user = await getUserFromRequest()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error('[TEAMS_GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = TeamBaseSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.format() }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    const dbData = {
      ...mapFrontendToDb(parsed.data),
      user_id: user.id
    }

    const { data, error } = await supabase
      .from('teams')
      .insert(dbData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[TEAMS_POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
