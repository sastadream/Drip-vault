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
  
  console.log('Starting file upload process for:', fullPath);

  // Check if file already exists
  const { data: existingFileData, error: listError } = await supabase.storage.from('study200').list(filePath, {
    search: file.name,
    limit: 1,
  });

  if (listError) {
      console.error('Error checking for existing file:', listError);
      // We don't return here, as it might be a permissions issue that doesn't prevent an upload.
  }

  if (existingFileData && existingFileData.length > 0) {
      console.log('File already exists at path:', fullPath);
      return { error: 'A file with this name already exists. Please rename the file and try again.' };
  }

  const { error: uploadError } = await supabase.storage.from('study200').upload(fullPath, file);

  if (uploadError) {
    console.error('Storage Upload Error:', uploadError);
    return { error: `Failed to upload file to storage: ${uploadError.message}` };
  }
  
  console.log('File successfully uploaded to storage.');

  const {
    data: { publicUrl },
  } = supabase.storage.from('study200').getPublicUrl(fullPath);
  
  console.log('Got public URL:', publicUrl);
  console.log('Attempting to insert into database with payload:', {
      subject_id: parseInt(subjectId),
      file_url: publicUrl,
      file_name: file.name,
      file_path: fullPath,
  });

  // By selecting data, we force Supabase to re-evaluate the schema for the 'files' table.
  const { error: dbError } = await supabase.from('files').insert({
    subject_id: parseInt(subjectId),
    file_url: publicUrl,
    file_name: file.name,
    file_path: fullPath,
  }).select('id').single();

  if (dbError) {
    console.error('Database Insert Error:', dbError);
    return { error: `Failed to save file metadata: ${dbError.message}` };
  }
  
  console.log('Successfully inserted file metadata into database.');

  revalidatePath(`/dashboard/${filePath}`);
  return { error: null };
}
