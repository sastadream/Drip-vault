'use client';

import React, { useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { uploadFile } from '@/actions/files';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';

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
    <Button type="submit" disabled={pending} className="w-full">
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

export function FileUploader({ subjectId, filePath }: { subjectId: number; filePath: string }) {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setError(null);

    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError('File is too large. Maximum size is 20MB.');
        e.target.value = ''; // Clear the input
        return;
      }
      if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
        setError(
          'Invalid file type. Only PDF, DOCX, PPTX, PNG, and JPG are allowed.'
        );
        e.target.value = ''; // Clear the input
        return;
      }
    }
  };

  const handleAction = async (formData: FormData) => {
    formData.append('subjectId', String(subjectId));
    formData.append('filePath', filePath);
    
    const result = await uploadFile(formData);

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
    }
  };

  return (
    <form ref={formRef} action={handleAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-subject">Select File</Label>
        <Input
          id="file-subject"
          name="file"
          type="file"
          onChange={handleFileChange}
          required
          className="file:text-primary file:font-semibold"
        />
        {error && <p className="text-sm font-medium text-destructive mt-2">{error}</p>}
      </div>
      <SubmitButton />
    </form>
  );
}
