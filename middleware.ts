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

    // Function to create a redirect that carries over the cookies
    const redirectWithCookies = (url: string) => {
      const redirectResponse = NextResponse.redirect(new URL(url, request.url))
      const isProd = process.env.NODE_ENV === 'production'
      
      // Copy cookies from the 'response' object (which has the refreshed session) to the redirect
      response.cookies.getAll().forEach((cookie) => {
        // Use the cookie's existing options if they exist, otherwise use defaults
        redirectResponse.cookies.set(cookie.name, cookie.value, {
          path: '/',
          ...cookie, // Spread existing options (maxAge, expires, etc.)
          secure: isProd, // Only secure in production
          sameSite: 'lax',
        })
      })
      return redirectResponse
    }

    // 1. Startup Roles
    if (role === 'startup') {
      if (status === 'pending') {
        if (!pathname.startsWith('/pending') && !pathname.startsWith('/api/')) {
          return redirectWithCookies('/pending')
        }
        return response
      }

      if (status === 'rejected') {
        if (!pathname.startsWith('/rejected') && !pathname.startsWith('/login')) {
          return redirectWithCookies('/rejected')
        }
        return response
      }

      // Approved Startup
      if (status === 'approved') {
        if (pathname === '/' || pathname.startsWith('/login')) {
           return redirectWithCookies('/startup')
        }
        if (pathname === '/startup/profile') {
           return redirectWithCookies('/startup/profiler')
        }
        if ((pathname.startsWith('/programme') || pathname.startsWith('/admin')) && !pathname.startsWith('/api/')) {
          return redirectWithCookies('/startup')
        }
        if (!pathname.startsWith('/startup') && !pathname.startsWith('/api/') && !pathname.startsWith('/pending')) {
          return redirectWithCookies('/startup')
        }
        return response
      }
    }

    // 2. Programme Team Role (Super Admin)
    if (role === 'programme_team') {
      if (pathname === '/' || pathname.startsWith('/login')) {
        return redirectWithCookies('/programme/dashboard')
      }
      if (pathname.startsWith('/startup') && !pathname.startsWith('/api/')) {
        return redirectWithCookies('/programme/dashboard')
      }
      return response
    }

    // 3. Admin Role (Cohort Lead)
    if (role === 'admin') {
      if (pathname === '/' || pathname.startsWith('/login')) {
        return redirectWithCookies('/admin/dashboard')
      }
      if (pathname.startsWith('/programme') && !pathname.startsWith('/api/')) {
        return redirectWithCookies('/admin/dashboard')
      }
      return response
    }

    // 4. Default Fallback for Logged-in users with unresolved roles
    // If we've reached here, they are logged in but profile lookup failed or is slow.
    // DO NOT allow them to fall back to /login as it creates a redirect loop.
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
