import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DEPARTMENTS } from '@/lib/constants';
import { Building2 } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DashboardFileUploader } from '@/components/DashboardFileUploader';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Dashboard | RizzVault',
};

export default function DashboardPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />
      <div className="space-y-8">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome to RizzVault</h1>
            <p className="text-muted-foreground">Your centralized hub for academic materials.</p>
        </div>

        <Card className="bg-gradient-to-br from-primary/10 to-transparent">
            <CardHeader>
                <CardTitle>Quick Upload</CardTitle>
                <CardDescription>Upload a file to any subject directly from here.</CardDescription>
            </CardHeader>
            <CardContent>
                <DashboardFileUploader />
            </CardContent>
        </Card>

        <Separator />

        <div>
            <h2 className="text-2xl font-bold tracking-tight mb-1">Browse Departments</h2>
            <p className="text-muted-foreground mb-6">Or select a department to view its materials.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {DEPARTMENTS.map((dept) => (
                <Link href={`/dashboard/${dept.slug}`} key={dept.slug} className="group">
                <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1.5 hover:border-primary/50 bg-card hover:bg-primary/5">
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
        </div>
      </div>
    </>
  );
}
