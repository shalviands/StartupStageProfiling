import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import React from 'react'
import { renderToStream } from '@react-pdf/renderer'
import { mapDbToFrontend } from '@/utils/mappers'
import DiagnosticPDF from '@/components/pdf/DiagnosticPDF'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getUserFromRequest()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createServerSupabaseClient()
    const { data: team, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !team) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Generate PDF stream
    const mappedTeam = mapDbToFrontend(team)
    if (!mappedTeam) throw new Error('Failed to map team data')
    
    const stream = await renderToStream(<DiagnosticPDF team={mappedTeam} />)
    
    // Return the stream as a PDF response
    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${team.startupName || 'Diagnosis'}-Brief.pdf"`,
      },
    })
  } catch (err) {
    console.error('[API PDF Error]', err)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
