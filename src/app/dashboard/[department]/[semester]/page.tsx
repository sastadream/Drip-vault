import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DEPARTMENTS, SEMESTERS, SUBJECTS } from '@/lib/constants';
import { BookMarked } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

type Props = {
  params: { department: string; semester: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const department = DEPARTMENTS.find((d) => d.slug === params.department);
  const semester = SEMESTERS.find((s) => s.slug === params.semester);
  const title = department && semester ? `Subjects for ${semester.name}` : 'Select Subject';
  return { title };
}

export default function SemesterPage({ params }: Props) {
  const { department: departmentSlug, semester: semesterSlug } = params;

  const department = DEPARTMENTS.find((d) => d.slug === departmentSlug);
  const semester = SEMESTERS.find((s) => s.slug === semesterSlug);

  if (!department || !semester) {
    notFound();
  }

  const subjects = SUBJECTS[departmentSlug]?.[semesterSlug] || [];

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: department.name, href: `/dashboard/${department.slug}` },
    { label: semester.name },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="text-3xl font-bold mb-6">Select a Subject</h1>
      {subjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subjects.map((sub) => (
            <Link
              href={`/dashboard/${department.slug}/${semester.slug}/${sub.slug}`}
              key={sub.slug}
              className="group"
            >
              <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-primary">
                <CardHeader className="flex flex-row items-center gap-4">
                  <BookMarked className="w-8 h-8 text-primary" />
                  <CardTitle className="text-lg">{sub.name}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No subjects found for this semester. Data is pre-populated for demonstration purposes.</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
