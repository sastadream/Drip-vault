import { AuthForm } from '@/components/AuthForm';
import { BookOpenCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <BookOpenCheck className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">Create Your EduVault Account</h1>
        <p className="text-center text-muted-foreground mb-8">
          Join now to start organizing your academic files.
        </p>
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
