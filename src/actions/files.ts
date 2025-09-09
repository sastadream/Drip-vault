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
  
  // Check if file already exists in storage
  const { data: existingStorageFile, error: storageError } = await supabase.storage.from('study200').list(filePath, {
    search: file.name,
    limit: 1,
  });

  if (storageError) {
    console.error('Error checking storage:', storageError);
    return { error: 'Could not verify file in storage. Please try again.' };
  }

  if (existingStorageFile && existingStorageFile.length > 0) {
      return { error: 'A file with this name already exists in storage. Please rename the file and try again.' };
  }
  
  const { error: uploadError } = await supabase.storage.from('study200').upload(fullPath, file);

  if (uploadError) {
    return { error: `Failed to upload file to storage: ${uploadError.message}` };
  }
  
  const {
    data: { publicUrl },
  } = supabase.storage.from('study200').getPublicUrl(fullPath);
  
  const { error: insertError } = await supabase
    .from('files')
    .insert({
      subject_id: parseInt(subjectId, 10),
      file_url: publicUrl,
      file_name: file.name,
    });

  if (insertError) {
    console.error('Database Insert Error:', insertError);
    // Attempt to clean up the uploaded file if the database insert fails
    await supabase.storage.from('study200').remove([fullPath]);
    return { error: `Failed to create database record: ${insertError.message}` };
  }

  revalidatePath(`/dashboard/${filePath}`);
  return { error: null };
}
