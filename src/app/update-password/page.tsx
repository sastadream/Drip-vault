
import { UpdatePasswordForm } from '@/components/UpdatePasswordForm';
import { BookOpenCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Update Password',
};

export default function UpdatePasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
            <BookOpenCheck className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">Update Your Password</h1>
        <p className="text-center text-muted-foreground mb-8">
            Enter and confirm your new password below.
        </p>
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
