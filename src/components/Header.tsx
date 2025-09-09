import { BookOpenCheck } from 'lucide-react';
import Link from 'next/link';

export async function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <BookOpenCheck className="h-7 w-7 text-primary" />
              <span className="font-bold text-xl tracking-tight">EduVault</span>
            </Link>
            <div className="border-l pl-4">
                <p className="text-sm font-semibold text-foreground/90">
                    Designed & Developed by Samir Desai
                    <span className="text-muted-foreground font-medium ml-1">(Aura ♾️)</span>
                </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
