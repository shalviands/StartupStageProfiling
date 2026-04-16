import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // ALWAYS call getUser() — this refreshes the session token
  // Do not replace this with getSession() — it is less secure
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ── Static assets and API — always allow, never redirect ─────────
  const isStaticOrApi =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')

  if (isStaticOrApi) {
    return response
  }

  // ── Auth callback — allow through (handles OAuth if ever added) ──
  if (pathname.startsWith('/auth/callback')) {
    return response
  }

  // ── User is NOT logged in ────────────────────────────────────────
  if (!user) {
    // Allow / and /login — they need to see the landing and login pages
    if (pathname === '/' || pathname.startsWith('/login')) {
      return response
    }
    // Anything else (/profiler, /dashboard, etc.) → /login
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // ── User IS logged in ────────────────────────────────────────────
  if (user) {
    // If they visit /login → send them to /profiler
    if (pathname.startsWith('/login')) {
      const profilerUrl = new URL('/profiler', request.url)
      return NextResponse.redirect(profilerUrl)
    }
    // Anywhere else (/, /profiler, /dashboard, etc.) → allow
    return response
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico
     * - files with extensions (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)',
  ],
}
