import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // Determine redirect URL based on whether we have a code
  const redirectTo = code ? `${origin}${next}` : `${origin}/?error=auth`

  // Create the redirect response FIRST so we can attach cookies to it
  const response = NextResponse.redirect(redirectTo)

  if (code) {
    // Create a Supabase client that sets cookies directly on the redirect response
    // This is critical: using cookies() from next/headers would set cookies on a
    // separate implicit response, not on our redirect response
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      // If exchange failed, redirect to error page
      return NextResponse.redirect(`${origin}/?error=auth`)
    }
  }

  return response
}
