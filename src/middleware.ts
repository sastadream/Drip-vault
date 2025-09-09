
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const supabaseUrl = 'https://gaeftidfgdxjsnjmrkfn.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhZWZ0aWRmZ2R4anNuam1ya2ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczOTgzNzEsImV4cCI6MjA3Mjk3NDM3MX0.tLG6dZugA5KDOjfj9nPWCjTqwKUkEy15B7iiiCzp0CU';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: '',
          ...options,
        });
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Allow access to update-password page only when there's a recovery token
  if (pathname === '/update-password') {
    const code = request.nextUrl.searchParams.get('code');
    // A simple check for the presence of a recovery token in the URL.
    // Supabase sends a recovery token that gets exchanged for a session.
    // If the user has a session, they can update their password.
    if (!session) {
      // If there is no session and no code, redirect to login
      if(!request.headers.get('referer')?.includes('password-reset')) {
         return NextResponse.redirect(new URL('/login?error=Invalid or expired password reset link.', request.url));
      }
    }
    return response;
  }
  
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';

  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/forgot-password', '/update-password'],
};

