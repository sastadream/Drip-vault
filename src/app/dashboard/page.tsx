import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
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
      <h1 className="text-3xl font-bold mb-6">Select a Department</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {DEPARTMENTS.map((dept) => (
          <Link href={`/dashboard/${dept.slug}`} key={dept.slug} className="group">
            <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-primary">
              <CardHeader className="flex flex-row items-center gap-4">
                <Building2 className="w-8 h-8 text-primary" />
                <CardTitle className="text-lg">{dept.name}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
