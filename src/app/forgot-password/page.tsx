
import { ForgotPasswordForm } from '@/components/ForgotPasswordForm';
import { BookOpenCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <BookOpenCheck className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">Forgot Your Password?</h1>
        <p className="text-center text-muted-foreground mb-8">
          Enter your email and we'll send you a link to reset it.
        </p>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
