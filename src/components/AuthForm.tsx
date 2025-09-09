'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { login, signup } from '@/actions/auth';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const signupSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one symbol.' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type AuthFormProps = {
  mode: 'login' | 'signup';
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === 'login';
  const schema = isLogin ? loginSchema : signupSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    setIsSubmitting(true);
    const action = isLogin ? login : signup;
    const result = await action(values);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: result.error,
      });
      setIsSubmitting(false);
    } else {
      toast({
        title: isLogin ? 'Login Successful' : 'Signup Successful',
        description: isLogin ? 'Welcome back!' : 'Please check your email to verify your account.',
      });
      router.refresh();
      if (isLogin) {
        // The middleware will handle redirection to /dashboard
      }
    }
    // Don't set submitting to false on success, as the page will refresh.
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLogin ? 'Log In' : 'Sign Up'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <Link href={isLogin ? '/signup' : '/login'} className="font-semibold text-primary hover:underline">
          {isLogin ? 'Sign up' : 'Log in'}
        </Link>
      </p>
    </Form>
  );
}
