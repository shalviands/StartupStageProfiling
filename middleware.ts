import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  /**
   * IMPORTANT: This is the canonical Supabase SSR middleware pattern.
   *
   * When Supabase refreshes the access token, it calls setAll() which:
   *  1. Mutates request.cookies in place
   *  2. Recreates `response` with the updated request so Server Components
   *     reading cookies() see the refreshed token
   *  3. Sets the new cookies on the response so the browser stores them
   *
   * Do NOT simplify setAll() to a one-liner — the response recreation is
   * required to forward updated cookies to Server Components on the same request.
   */
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          // Step 1: Mutate the request cookies in place
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          // Step 2: Recreate response with updated request (forwards new cookies to Server Components)
          response = NextResponse.next({ request })
          // Step 3: Set on response so browser stores them
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // ALWAYS call getUser() — validates JWT with Supabase server and refreshes if needed.
  // getSession() is NOT used here as it only reads local state (less secure).
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ── Static assets and API routes — always pass through ───────────
  const isStaticOrApi =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')

  if (isStaticOrApi) return response

  // ── Auth callback — pass through ─────────────────────────────────
  if (pathname.startsWith('/auth/callback')) return response

  // ── User is NOT logged in ─────────────────────────────────────────
  if (!user) {
    const publicPaths = ['/', '/login', '/register', '/pending', '/rejected']
    const isPublic = publicPaths.some(p =>
      pathname === p || pathname.startsWith(p + '/')
    )
    if (isPublic) return response

    // Redirect to login, preserve intended destination
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ── User IS logged in ─────────────────────────────────────────────
  //
  // Strategy: Try to get role from the DB (profiles table). If that fails
  // (network issue / RLS misconfiguration), fall back to the role stored
  // in the user's JWT metadata so we never lock a valid user out.

  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', user.id)
    .single()

  // Use DB role if available; fall back to JWT metadata role
  const role: string =
    profile?.role ??
    (user.user_metadata?.role as string) ??
    'startup'

  const status: string = profile?.status ?? 'pending'

  if (profileErr) {
    console.warn(
      `[Middleware] Profile DB lookup failed for user ${user.id}:`,
      profileErr.message,
      '— falling back to JWT metadata role:',
      role
    )
  }

  // Helper: redirect and carry session cookies through
  const redirectWithCookies = (url: string) => {
    const redirectResponse = NextResponse.redirect(new URL(url, request.url))
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, {
        path: cookie.path ?? '/',
        sameSite: (cookie.sameSite as any) ?? 'lax',
        httpOnly: cookie.httpOnly ?? true,
        secure: cookie.secure,
        maxAge: cookie.maxAge,
        expires: cookie.expires,
      })
    })
    return redirectResponse
  }

  // ── Role: startup ─────────────────────────────────────────────────
  if (role === 'startup') {
    if (status === 'pending') {
      if (!pathname.startsWith('/pending')) return redirectWithCookies('/pending')
      return response
    }
    if (status === 'rejected') {
      if (!pathname.startsWith('/rejected') && !pathname.startsWith('/login')) {
        return redirectWithCookies('/rejected')
      }
      return response
    }
    // Approved startup
    if (pathname === '/' || pathname.startsWith('/login')) {
      return redirectWithCookies('/startup')
    }
    if (pathname === '/startup/profile') {
      return redirectWithCookies('/startup/profiler')
    }
    if ((pathname.startsWith('/programme') || pathname.startsWith('/admin'))) {
      return redirectWithCookies('/startup')
    }
    if (!pathname.startsWith('/startup') && !pathname.startsWith('/pending')) {
      return redirectWithCookies('/startup')
    }
    return response
  }

  // ── Role: programme_team ──────────────────────────────────────────
  if (role === 'programme_team') {
    if (pathname === '/' || pathname.startsWith('/login')) {
      return redirectWithCookies('/programme/dashboard')
    }
    if (pathname.startsWith('/startup')) {
      return redirectWithCookies('/programme/dashboard')
    }
    return response
  }

  // ── Role: admin ───────────────────────────────────────────────────
  if (role === 'admin') {
    if (pathname === '/' || pathname.startsWith('/login')) {
      return redirectWithCookies('/admin/dashboard')
    }
    if (pathname.startsWith('/programme')) {
      return redirectWithCookies('/admin/dashboard')
    }
    return response
  }

  // ── Unknown role: pass through (do NOT redirect to /login) ────────
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)',
  ],
}
