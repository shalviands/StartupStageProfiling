import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if profile exists using admin client
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (profile) {
      return NextResponse.json({ success: true, message: 'Profile already exists' })
    }

    const { fullName, startupName } = await req.json()

    // Insert missing profile with fallback details using admin client
    const { error: insertError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: fullName || user.user_metadata?.full_name || 'Venture Founder',
        startup_name: startupName || user.user_metadata?.startup_name || 'New Venture',
        role: 'startup',
        status: 'pending' // pending by default for startups
      })

    if (insertError) {
      console.error('[Sync Profile] Insert failed:', insertError)
      return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Profile created successfully' })
  } catch (error: any) {
    console.error('[Sync Profile]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
