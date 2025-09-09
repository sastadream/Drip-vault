import { BookOpenCheck } from 'lucide-react';
import Link from 'next/link';

export async function Header() {
  return (
    <header className="bg-card border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <BookOpenCheck className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl">EduVault</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
