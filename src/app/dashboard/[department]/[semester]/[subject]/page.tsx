import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DEPARTMENTS, SEMESTERS, SUBJECTS } from '@/lib/constants';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { FileUploader } from '@/components/FileUploader';
import { FileNameGenerator } from '@/components/FileNameGenerator';
import { createClient } from '@/lib/supabase/server';
import { FileList } from '@/components/FileList';

type Props = {
  params: { department: string; semester: string; subject: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const subject = SUBJECTS[params.department]?.[params.semester]?.find(
    (sub) => sub.slug === params.subject
  );
  const title = subject ? subject.name : 'Subject Files';
  return { title };
}

export default async function SubjectPage({ params }: Props) {
  const { department: departmentSlug, semester: semesterSlug, subject: subjectSlug } = params;

  const department = DEPARTMENTS.find((d) => d.slug === departmentSlug);
  const semester = SEMESTERS.find((s) => s.slug === semesterSlug);
  const subject = SUBJECTS[departmentSlug]?.[semesterSlug]?.find((sub) => sub.slug === subjectSlug);

  if (!department || !semester || !subject) {
    notFound();
  }
  
  // For the demo subject, we use a fallback ID to ensure it always works.
  const subjectId = (departmentSlug === 'robotic-and-automation-engineering' && semesterSlug === 'sem-1' && subjectSlug === 'design-thinking') ? 1 : null;

  const supabase = createClient();
  let files: any[] = [];
  if (subjectId) {
      const { data } = await supabase.from('files').select('*').eq('subject_id', subjectId).order('uploaded_at', { ascending: false });
      files = data || [];
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: department.name, href: `/dashboard/${department.slug}` },
    { label: semester.name, href: `/dashboard/${department.slug}/${semester.slug}` },
    { label: subject.name },
  ];

  const fullPath = `${department.slug}/${semester.slug}/${subject.slug}`;

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>{subject.name} Files</CardTitle>
                    <CardDescription>Browse and manage all uploaded materials for this subject.</CardDescription>
                </CardHeader>
                <CardContent>
                    {subjectId ? (
                        <FileList files={files} />
                    ) : (
                        <p className="text-muted-foreground">This subject is not configured for file uploads yet. Ensure database is set up correctly with departments, semesters, and subjects.</p>
                    )}
                </CardContent>
            </Card>
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>
                Add a new document to this subject. Max size: 20MB.
              </CardDescription>
            </CardHeader>
            <CardContent>
                {subjectId ? (
                    <FileUploader subjectId={subjectId} filePath={fullPath} />
                ) : (
                    <p className="text-muted-foreground text-sm">Uploading is disabled for this subject.</p>
                )}
            </CardContent>
          </Card>
          <FileNameGenerator />
        </div>
      </div>
    </>
  );
}
