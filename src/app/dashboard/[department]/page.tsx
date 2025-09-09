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
      <h1 className="text-3xl font-bold mb-6">Select a Semester</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {SEMESTERS.map((sem) => (
          <Link href={`/dashboard/${department.slug}/${sem.slug}`} key={sem.slug} className="group">
            <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-primary">
              <CardHeader className="flex flex-row items-center gap-4">
                <GraduationCap className="w-8 h-8 text-primary" />
                <CardTitle className="text-lg">{sem.name}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
