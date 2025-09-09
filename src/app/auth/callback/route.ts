
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type CookieOptions, createServerClient } from '@supabase/ssr';

const supabaseUrl = 'https://gaeftidfgdxjsnjmrkfn.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhZWZ0aWRmZ2R4anNuam1ya2ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczOTgzNzEsImV4cCI6MjA3Mjk3NDM3MX0.tLG6dZugA5KDOjfj9nPWCjTqwKUkEy15B7iiiCzp0CU';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const type = searchParams.get('type');

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    });
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
        if(type === 'recovery') {
            return NextResponse.redirect(`${origin}/update-password`);
        }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  console.error('Authentication error:', 'Could not exchange code for session.');
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}

