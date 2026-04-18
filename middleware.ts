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
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          
          // Sync headers for downstream request
          const requestHeaders = new Headers(request.headers)
          requestHeaders.set('Cookie', request.cookies.getAll().map(c => `${c.name}=${c.value}`).join('; '))

          response = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          })
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
    // Allow /, /login, /register, /pending, and /rejected
    if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/pending') || pathname.startsWith('/rejected')) {
      return response
    }
    // Anything else (/profiler, /dashboard, etc.) → /login
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // ── User IS logged in ────────────────────────────────────────────
  if (user) {
    // Check their profile to enforce role-based access
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single()

    const role = profile?.role
    const status = profile?.status

    // 1. Startup Roles
    if (role === 'startup') {
      if (status === 'pending') {
        if (!pathname.startsWith('/pending') && !pathname.startsWith('/api/')) {
          return NextResponse.redirect(new URL('/pending', request.url))
        }
        return response
      }

      if (status === 'rejected') {
        if (!pathname.startsWith('/rejected') && !pathname.startsWith('/login')) {
          return NextResponse.redirect(new URL('/rejected', request.url))
        }
        return response
      }

      // Approved Startup — land on dashboard/submissions, NOT profiler
      if (status === 'approved') {
        // Home/Login -> /startup (submissions list)
        if (pathname === '/' || pathname.startsWith('/login')) {
           return NextResponse.redirect(new URL('/startup', request.url))
        }
        // Redirect from old /startup/profile to new /startup/profiler
        if (pathname === '/startup/profile') {
           return NextResponse.redirect(new URL('/startup/profiler', request.url))
        }
        // Restrict access to other areas
        if ((pathname.startsWith('/programme') || pathname.startsWith('/admin')) && !pathname.startsWith('/api/')) {
          return NextResponse.redirect(new URL('/startup', request.url))
        }
        // Must stay in /startup
        if (!pathname.startsWith('/startup') && !pathname.startsWith('/api/') && !pathname.startsWith('/pending')) {
          return NextResponse.redirect(new URL('/startup', request.url))
        }
        return response
      }
    }

    // 2. Programme Team Role
    if (role === 'programme_team') {
      if (pathname === '/' || pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/programme/dashboard', request.url))
      }
      // Restrict access to other areas
      if ((pathname.startsWith('/admin') || pathname.startsWith('/startup')) && !pathname.startsWith('/api/')) {
        return NextResponse.redirect(new URL('/programme/dashboard', request.url))
      }
      // Redirect from old /profiler to new /programme/dashboard or similar?
      // Actually /profiler was specifically for them before.
      if (pathname === '/profiler') {
        return NextResponse.redirect(new URL('/programme/dashboard', request.url))
      }
      return response
    }

    // 3. Admin Role
    if (role === 'admin') {
      if (pathname === '/' || pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
      return response
    }
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
