import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { DEPARTMENTS, SEMESTERS } from '@/lib/constants';
import { GraduationCap } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

type Props = {
  params: { department: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const department = DEPARTMENTS.find((d) => d.slug === params.department);
  const title = department ? `Semesters in ${department.name}` : 'Select Semester';
  return { title };
}

export default function DepartmentPage({ params }: Props) {
  const department = DEPARTMENTS.find((d) => d.slug === params.department);

  if (!department) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: department.name },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Select a Semester</h1>
        <p className="text-muted-foreground mt-1">Which semester's materials are you looking for?</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {SEMESTERS.map((sem) => (
          <Link href={`/dashboard/${department.slug}/${sem.slug}`} key={sem.slug} className="group">
            <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1.5 hover:shadow-primary/20 border-2 border-transparent hover:border-primary/50">
              <CardHeader className="flex flex-row items-center gap-4 p-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold">{sem.name}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
