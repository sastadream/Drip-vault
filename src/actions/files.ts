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

  const { data: existingFileData, error: listError } = await supabase.storage.from('study200').list(filePath, {
    search: file.name,
    limit: 1,
  });

  if (listError) {
      console.error('Error checking for existing file:', listError);
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
  
  // Step 1: Insert a new record with just the subject_id to get a new ID.
  console.log('Attempting to insert initial record with subject_id:', subjectId);
  const { data: newFileData, error: initialInsertError } = await supabase
    .from('files')
    .insert({ subject_id: parseInt(subjectId) })
    .select('id')
    .single();

  if (initialInsertError || !newFileData) {
    console.error('Database Initial Insert Error:', initialInsertError);
    // Note: We are not deleting the file from storage to avoid permissions issues.
    return { error: `Failed to create initial file record: ${initialInsertError?.message}` };
  }

  const newFileId = newFileData.id;
  console.log('Successfully created initial record with ID:', newFileId);
  
  // Step 2: Update the record with the rest of the file information.
  console.log('Attempting to update record with file metadata.');
  const { error: updateError } = await supabase
    .from('files')
    .update({
      file_url: publicUrl,
      file_name: file.name,
      file_path: fullPath,
    })
    .eq('id', newFileId);

  if (updateError) {
    console.error('Database Update Error:', updateError);
    // Note: We are not deleting the file from storage to avoid permissions issues.
    return { error: `Failed to update file metadata: ${updateError.message}` };
  }

  console.log('Successfully updated file metadata in database.');

  revalidatePath(`/dashboard/${filePath}`);
  return { error: null };
}
