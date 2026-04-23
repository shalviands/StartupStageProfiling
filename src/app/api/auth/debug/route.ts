import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    const cookieStore = cookies()
    const allCookies = cookieStore.getAll().map(c => ({ name: c.name, value: c.name.includes('token') ? '***' : c.value }))

    return NextResponse.json({
      authenticated: !!user,
      userId: user?.id || null,
      email: user?.email || null,
      role: user?.user_metadata?.role || null,
      cookieCount: allCookies.length,
      cookies: allCookies,
      timestamp: new Date().toISOString()
    })
  } catch (err: any) {
    return NextResponse.json({
      authenticated: false,
      error: err.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
