'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { uploadFile } from '@/actions/files';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DEPARTMENTS, SEMESTERS, SUBJECTS } from '@/lib/constants';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'image/png',
  'image/jpeg',
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Uploading...
        </>
      ) : (
        <>
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </>
      )}
    </Button>
  );
}

export function DashboardFileUploader() {
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const availableSemesters = useMemo(() => (department ? SEMESTERS : []), [department]);
  const availableSubjects = useMemo(
    () => (department && semester ? SUBJECTS[department]?.[semester] || [] : []),
    [department, semester]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setError(null);

    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError('File is too large. Maximum size is 20MB.');
        setFile(null);
        setFileName('');
        return;
      }
      if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
        setError('Invalid file type. Only PDF, DOCX, PPTX, PNG, and JPG are allowed.');
        setFile(null);
        setFileName('');
        return;
      }
      setFileName(selectedFile.name);
    } else {
        setFileName('');
    }
    setFile(selectedFile);
  };
  
  const handleAction = async (formData: FormData) => {
    const customFileName = formData.get('fileName') as string;
    const originalFile = formData.get('file') as File;

    if (!customFileName) {
         toast({
            variant: 'destructive',
            title: 'File name is required.',
        });
        return;
    }
    
    if (!originalFile || originalFile.size === 0) {
        toast({
            variant: 'destructive',
            title: 'File is required.',
        });
        return;
    }

    const subjectId = (department === 'robotic-and-automation-engineering' && semester === 'sem-1' && subject === 'design-thinking') ? '1' : null;
    
    if (!subjectId) {
        toast({
            variant: 'destructive',
            title: 'Upload Not Configured',
            description: 'This subject is not configured for uploads. Please select "Design Thinking" for demo.',
        });
        return;
    }

    const filePath = `${department}/${semester}/${subject}`;
    
    // We need to recreate the file object with the new name
    const newFile = new File([originalFile], customFileName, { type: originalFile.type });
    
    const newFormData = new FormData();
    newFormData.append('subjectId', subjectId);
    newFormData.append('filePath', filePath);
    newFormData.append('file', newFile);

    const result = await uploadFile(newFormData);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: result.error,
      });
    } else {
      toast({
        title: 'Upload Successful',
        description: 'Your file has been uploaded.',
      });
      formRef.current?.reset();
      setFile(null);
      setDepartment('');
      setSemester('');
      setSubject('');
      setFileName('');
    }
  };

  return (
    <form ref={formRef} action={handleAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department-dashboard">Department</Label>
          <Select name="department" value={department} onValueChange={setDepartment}>
            <SelectTrigger id="department-dashboard">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d.slug} value={d.slug}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="semester-dashboard">Semester</Label>
          <Select name="semester" value={semester} onValueChange={setSemester} disabled={!department}>
            <SelectTrigger id="semester-dashboard">
              <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent>
              {availableSemesters.map((s) => (
                <SelectItem key={s.slug} value={s.slug}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject-dashboard">Subject</Label>
          <Select name="subject" value={subject} onValueChange={setSubject} disabled={!semester}>
            <SelectTrigger id="subject-dashboard">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {availableSubjects.map((s) => (
                <SelectItem key={s.slug} value={s.slug}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="file-dashboard">Select File</Label>
            <Input
            id="file-dashboard"
            name="file"
            type="file"
            onChange={handleFileChange}
            required
            className="file:text-primary file:font-semibold"
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor="fileName-dashboard">File Name (Required)</Label>
            <Input
            id="fileName-dashboard"
            name="fileName"
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter a descriptive name for the file"
            required
            />
        </div>
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
