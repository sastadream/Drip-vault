'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FileText,
  FileImage,
  FileArchive,
  Download,
  MoreVertical,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const getFileIcon = (fileName: string) => {
  if (fileName.endsWith('.pdf')) return <FileText className="h-5 w-5 text-red-500" />;
  if (fileName.endsWith('.docx')) return <FileText className="h-5 w-5 text-blue-500" />;
  if (fileName.endsWith('.pptx')) return <FileText className="h-5 w-5 text-orange-500" />;
  if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg'))
    return <FileImage className="h-5 w-5 text-green-500" />;
  return <FileArchive className="h-5 w-5 text-gray-500" />;
};

type FileItem = {
  id: number;
  file_name: string;
  file_path: string;
  file_url: string;
  uploaded_at: string;
};

export function FileList({ files }: { files: FileItem[] }) {
  if (files.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No files have been uploaded for this subject yet.</p>;
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Uploaded</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell>{getFileIcon(file.file_name)}</TableCell>
                <TableCell className="font-medium">
                    <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {file.file_name}
                    </a>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {new Date(file.uploaded_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <a href={file.file_url} download>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
