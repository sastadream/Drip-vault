
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function signup(values: z.infer<typeof signupSchema>) {
  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  return { error: null };
}

export async function login(values: z.infer<typeof loginSchema>) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    return { error: error.message };
  }
  revalidatePath('/', 'layout');
  return { error: null };
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function requestPasswordReset(email: string) {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
    });
    if (error) {
        return { error: error.message };
    }
    return { error: null };
}

export async function updateUserPassword(password: string) {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
        return { error: 'Could not update password. The link may have expired.' };
    }
    return { error: null };
}
