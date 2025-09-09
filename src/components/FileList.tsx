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
  Trash2,
  MoreVertical,
  Loader2,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { deleteFile } from '@/actions/files';
import { useToast } from '@/hooks/use-toast';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

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
  const { toast } = useToast();
  const pathname = usePathname();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);

  const confirmDelete = (file: FileItem) => {
    setFileToDelete(file);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;
    setDeletingId(fileToDelete.id);
    setDialogOpen(false);

    const result = await deleteFile(fileToDelete.id, fileToDelete.file_path, pathname);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: result.error,
      });
    } else {
      toast({
        title: 'File Deleted',
        description: `${fileToDelete.file_name} has been successfully deleted.`,
      });
    }
    setDeletingId(null);
    setFileToDelete(null);
  };

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
                  {deletingId === file.id ? (
                    <Loader2 className="h-5 w-5 animate-spin ml-auto" />
                  ) : (
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
                        <DropdownMenuItem onClick={() => confirmDelete(file)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the file{' '}
              <span className="font-semibold">{fileToDelete?.file_name}</span> and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
