import { createClient } from '@/lib/supabase/server';
import { BookOpenCheck, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { logout } from '@/actions/auth';
import Link from 'next/link';

export async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="bg-card border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <BookOpenCheck className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl">EduVault</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
            <form action={logout}>
              <Button variant="ghost" size="icon" aria-label="Log out">
                <LogOut className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
