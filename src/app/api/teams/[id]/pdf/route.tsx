import { NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import DiagnosisPDF from '@/components/pdf/DiagnosisPDF'
import { mapDbToFrontend } from '@/utils/mappers'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Programme team and admin can download any PDF
    // Startups can only download if diagnosis is released
    const isPowerUser = ['programme_team', 'admin'].includes(profile?.role ?? '')

    const { data: team } = await supabaseAdmin
      .from('teams')
      .select('*')
      .eq('id', params.id)
      .single()

    if (!team) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (!isPowerUser) {
      if (team.startup_user_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      if (!team.diagnosis_released) {
        return NextResponse.json({ error: 'Diagnosis not yet released' }, { status: 403 })
      }
      // Ensure admin_notes are completely removed before passing to the PDF renderer
      delete team.admin_notes
    }

    const mappedTeam = mapDbToFrontend(team)
    if (!mappedTeam) {
      return NextResponse.json({ error: 'Failed to map team data' }, { status: 500 })
    }

    // Generate PDF buffer
    // @ts-ignore - React-PDF types can be finicky in server environments
    const pdfBuffer = await renderToBuffer(<DiagnosisPDF team={mappedTeam} />)

    const filename = `${mappedTeam.startupName || 'Startup'}_Diagnosis_Report_${new Date().toISOString().split('T')[0]}.pdf`

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename.replace(/ /g, '_')}"`,
      },
    })

  } catch (error) {
    console.error('[PDF Generation Error]:', error)
    return NextResponse.json(
      { error: 'PDF generation failed' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request, ctx: { params: { id: string } }) {
  return POST(req, ctx)
}
