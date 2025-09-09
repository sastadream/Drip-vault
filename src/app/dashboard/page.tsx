import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DEPARTMENTS } from '@/lib/constants';
import { Building2 } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Select Department',
};

export default function DashboardPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Select a Department</h1>
        <p className="text-muted-foreground mt-1">Choose your field of study to get started.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {DEPARTMENTS.map((dept) => (
          <Link href={`/dashboard/${dept.slug}`} key={dept.slug} className="group">
            <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1.5 hover:shadow-primary/20 border-2 border-transparent hover:border-primary/50">
              <CardHeader className="flex flex-col items-center text-center gap-4 p-8">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold">{dept.name}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
