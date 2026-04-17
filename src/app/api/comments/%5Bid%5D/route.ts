import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUserFromRequest()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createServerSupabaseClient()
  const { id } = params
  const { comment_text } = await request.json()

  if (!comment_text?.trim()) {
    return NextResponse.json({ error: 'comment_text required' }, { status: 400 })
  }

  // Check ownership
  const { data: existing } = await supabase
    .from('submission_comments')
    .select('commenter_id')
    .eq('id', id)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
  }

  if (existing.commenter_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('submission_comments')
    .update({ 
      comment_text: comment_text.trim(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUserFromRequest()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createServerSupabaseClient()
  const { id } = params

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  // Check ownership or admin role
  const { data: existing } = await supabase
    .from('submission_comments')
    .select('commenter_id')
    .eq('id', id)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
  }

  const isOwner = existing.commenter_id === user.id
  const isAdmin = profile?.role === 'admin'

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await supabase
    .from('submission_comments')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
