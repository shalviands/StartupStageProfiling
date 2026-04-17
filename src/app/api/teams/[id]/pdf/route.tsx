import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import React from 'react'
import { renderToStream } from '@react-pdf/renderer'
import { mapDbToFrontend } from '@/utils/mappers'
import DiagnosticPDF from '@/components/pdf/DiagnosticPDF'

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const user = await getUserFromRequest()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createServerSupabaseClient()

    // 1. Get user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // 2. Fetch team
    const { data: team, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !team) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // 3. Security Check
    const isOwner = team.user_id === user.id
    const isStartupOwner = team.startup_user_id === user.id
    const isAdmin = profile?.role === 'admin'
    
    if (!isAdmin && !isOwner && !isStartupOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Generate PDF stream
    const mappedTeam = mapDbToFrontend(team)
    if (!mappedTeam) throw new Error('Failed to map team data')
    
    const stream = await renderToStream(<DiagnosticPDF team={mappedTeam} />)
    
    // Return the stream as a PDF response
    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'no-cache',
        'Content-Disposition': `attachment; filename="${(team.startup_name || 'Diagnosis').replace(/[^a-z0-9]/gi, '_')}-Report.pdf"`,
      },
    })
  } catch (err) {
    console.error('[API PDF Error]', err)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
