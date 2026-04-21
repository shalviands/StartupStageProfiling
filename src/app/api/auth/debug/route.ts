import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const allCookies = cookieStore.getAll()

  // Identify Supabase auth cookies specifically
  const authCookies = allCookies.filter(c =>
    c.name.includes('auth-token') || c.name.includes('sb-') || c.name.startsWith('supabase')
  )

  try {
    // Test 1: Server Supabase client (same as layouts/pages use)
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    let profile = null
    let profileError = null

    if (user) {
      const result = await supabase
        .from('profiles')
        .select('id, email, role, status, full_name')
        .eq('id', user.id)
        .single()
      profile = result.data
      profileError = result.error
    }

    // Test 2: Middleware-style client (directly from request cookies)
    let middlewareUser = null
    let middlewareUserError = null
    try {
      const middlewareClient = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return cookieStore.getAll() },
            setAll() { /* read-only in this route */ },
          },
        }
      )
      const { data: { user: mu }, error: me } = await middlewareClient.auth.getUser()
      middlewareUser = mu
      middlewareUserError = me
    } catch (e: any) {
      middlewareUserError = { message: e.message }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30) + '...',

      cookies: {
        total: allCookies.length,
        auth_cookies_found: authCookies.length,
        auth_cookie_names: authCookies.map(c => c.name),
      },

      server_client: {
        user_found: !!user,
        user_id: user?.id ?? null,
        user_email: user?.email ?? null,
        user_error: userError?.message ?? null,
        profile_found: !!profile,
        profile_role: profile?.role ?? null,
        profile_status: profile?.status ?? null,
        profile_error: profileError?.message ?? profileError?.code ?? null,
      },

      middleware_style_client: {
        user_found: !!middlewareUser,
        user_id: middlewareUser?.id ?? null,
        user_error: (middlewareUserError as any)?.message ?? null,
      },
    })
  } catch (err: any) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      fatal_error: err.message,
      cookies: {
        total: allCookies.length,
        auth_cookie_names: authCookies.map(c => c.name),
      },
    }, { status: 500 })
  }
}
