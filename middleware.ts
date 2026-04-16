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
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
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

  // IMPORTANT: always call getUser() to refresh the session token
  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname
  const isLoginPage = path.startsWith('/login')
  const isPublicPath = isLoginPage || path.startsWith('/api/') || path.startsWith('/_next') || path.startsWith('/favicon')

  // 1. If logged in and trying to access login page -> redirect to dashboard
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/profiler', request.url))
  }

  // 2. If not logged in and trying to access protected path -> redirect to login
  if (!user && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
