import { AuthForm } from '@/components/AuthForm';
import { BookOpenCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <BookOpenCheck className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back to EduVault</h1>
        <p className="text-center text-muted-foreground mb-8">
          Sign in to access your academic repository.
        </p>
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
