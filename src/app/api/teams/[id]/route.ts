import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import { TeamUpdateSchema } from '@/types/team.types'
import { mapFrontendToDb } from '@/utils/mappers'

async function getTeamOrDeny(id: string, userId: string) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  if (error || !data) return null
  return data
}

export async function GET(
  _req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getUserFromRequest()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const team = await getTeamOrDeny(id, user.id)
  if (!team) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(team)
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getUserFromRequest()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await getTeamOrDeny(id, user.id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json()
  const parsed = TeamUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('teams')
    .update({
      ...mapFrontendToDb(parsed.data),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('[PUT /api/teams/[id]]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  _req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getUserFromRequest()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await getTeamOrDeny(id, user.id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from('teams')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('[DELETE /api/teams/[id]]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
