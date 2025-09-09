'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/png',
  'image/jpeg',
];

export async function uploadFile(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to upload files.' };
  }

  const file = formData.get('file') as File;
  const subjectId = formData.get('subjectId') as string;
  const filePath = formData.get('filePath') as string;

  if (!file) return { error: 'No file provided.' };
  if (!subjectId) return { error: 'Subject not specified.' };
  if (!filePath) return { error: 'File path not specified.' };

  if (file.size > MAX_FILE_SIZE) {
    return { error: 'File is too large. Maximum size is 20MB.' };
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { error: 'Invalid file type.' };
  }

  const fullPath = `${filePath}/${file.name}`;

  const { error: uploadError } = await supabase.storage.from('files').upload(fullPath, file);

  if (uploadError) {
    console.error('Upload Error:', uploadError);
    return { error: 'Failed to upload file to storage.' };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('files').getPublicUrl(fullPath);

  const { error: dbError } = await supabase.from('files').insert({
    subject_id: parseInt(subjectId),
    user_id: user.id,
    file_url: publicUrl,
    file_name: file.name,
    file_path: fullPath,
  });

  if (dbError) {
    console.error('Database Error:', dbError);
    // Attempt to clean up storage if DB insert fails
    await supabase.storage.from('files').remove([fullPath]);
    return { error: 'Failed to save file metadata.' };
  }

  revalidatePath(`/dashboard/${filePath}`);
  return { error: null };
}

export async function deleteFile(fileId: number, filePath: string, pagePath: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Authentication required.' };
    }

    // First, check if the user is the owner of the file
    const { data: fileData, error: fetchError } = await supabase
        .from('files')
        .select('user_id')
        .eq('id', fileId)
        .single();

    if (fetchError || !fileData) {
        return { error: 'File not found.' };
    }

    if (fileData.user_id !== user.id) {
        return { error: 'You do not have permission to delete this file.' };
    }
    
    // Delete from storage
    const { error: storageError } = await supabase.storage.from('files').remove([filePath]);
    if (storageError) {
        console.error('Storage Deletion Error:', storageError);
        return { error: 'Failed to delete file from storage.' };
    }
    
    // Delete from database
    const { error: dbError } = await supabase.from('files').delete().eq('id', fileId);
    if (dbError) {
        console.error('DB Deletion Error:', dbError);
        return { error: 'Failed to delete file record.' };
    }
    
    revalidatePath(pagePath);
    return { error: null };
}
