import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getUserFromRequest } from '@/lib/supabase/getUser'
import * as XLSX from 'xlsx'
import { mapDbToFrontend } from '@/utils/mappers'
import { calculateOverallScore } from '@/utils/scores'

export async function GET() {
  try {
    const user = await getUserFromRequest()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = await createServerSupabaseClient()
    
    // Auth Check: Admin or Programme Team
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin' && profile?.role !== 'programme_team') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch released teams (Blueprint v2.0 logic) with admin client to bypass RLS
    const { data: teams, error } = await supabaseAdmin
      .from('teams')
      .select('*')
      .eq('diagnosis_released', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform for Excel
    const rows = (teams || []).map(t => {
      const mapped = mapDbToFrontend(t)
      if (!mapped) return null
      
      const { overall, averages } = calculateOverallScore(mapped)
      
      return {
        'Submission ID': t.id.slice(0, 8),
        'Startup Name': t.startup_name,
        'Sector': t.sector,
        'Institution': t.institution,
        'Date Submitted': t.created_at ? new Date(t.created_at).toLocaleDateString() : 'N/A',
        'Submitted By (Form)': t.interviewer,
        'Overall Score': overall.toFixed(2),
        'Detected Stage': t.detected_stage,
        'P1 (Character)': averages.p1.toFixed(1),
        'P2 (Customer)': averages.p2.toFixed(1),
        'P3 (Product)': averages.p3.toFixed(1),
        'P4 (Differentiation)': averages.p4.toFixed(1),
        'P5 (Market)': averages.p5.toFixed(1),
        'P6 (Business)': averages.p6.toFixed(1),
        'P7 (Traction)': averages.p7.toFixed(1),
        'P8 (Team)': averages.p8.toFixed(1),
        'P9 (Moats)': averages.p9.toFixed(1),
      }
    }).filter(Boolean)

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Startups')
    
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Startup_Portfolio_Export.xlsx"',
      },
    })
  } catch (err: any) {
    console.error('[EXPORT_API]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
