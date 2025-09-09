'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { uploadFile } from '@/actions/files';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { Card, CardContent } from './ui/card';

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
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setError(null);

    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError('File is too large. Maximum size is 20MB.');
        setFile(null);
        return;
      }
      if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
        setError(
          'Invalid file type. Only PDF, DOCX, PPTX, PNG, and JPG are allowed.'
        );
        setFile(null);
        return;
      }
    }
    setFile(selectedFile);
  };

  const handleAction = async (formData: FormData) => {
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
      setFile(null);
    }
  };

  return (
    <form ref={formRef} action={handleAction} className="space-y-4">
      <input type="hidden" name="subjectId" value={subjectId} />
      <input type="hidden" name="filePath" value={filePath} />
      <div className="space-y-2">
        <Label htmlFor="file">Select File</Label>
        <Input
          id="file"
          name="file"
          type="file"
          onChange={handleFileChange}
          required
          className="file:text-primary file:font-semibold"
        />
        {file && (
            <Card className="mt-4">
                <CardContent className="pt-4 text-sm">
                    <p><strong>Selected:</strong> {file.name}</p>
                    <p className="text-muted-foreground"><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </CardContent>
            </Card>
        )}
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      </div>
      <SubmitButton />
    </form>
  );
}
