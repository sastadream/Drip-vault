'use server';
/**
 * @fileOverview AI-powered file name generation flow.
 *
 * - generateFileName - A function that takes file content as input and suggests a descriptive file name.
 * - GenerateFileNameInput - The input type for the generateFileName function.
 * - GenerateFileNameOutput - The return type for the generateFileName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFileNameInputSchema = z.object({
  fileContent: z
    .string()
    .describe('The content of the file as a string.'),
  fileType: z.string().describe('The type of the file (e.g., PDF, DOCX).'),
});
export type GenerateFileNameInput = z.infer<typeof GenerateFileNameInputSchema>;

const GenerateFileNameOutputSchema = z.object({
  suggestedFileName: z
    .string()
    .describe('The AI-suggested descriptive file name.'),
});
export type GenerateFileNameOutput = z.infer<typeof GenerateFileNameOutputSchema>;

export async function generateFileName(
  input: GenerateFileNameInput
): Promise<GenerateFileNameOutput> {
  return generateFileNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFileNamePrompt',
  input: {schema: GenerateFileNameInputSchema},
  output: {schema: GenerateFileNameOutputSchema},
  prompt: `You are an AI assistant that suggests descriptive file names based on the content of the file.

  Analyze the file content and file type provided to generate a concise and informative file name.
  The file name should accurately reflect the document's subject matter and purpose.
  Return only the suggested file name, without any additional explanations or formatting.

  File Content:
  {{fileContent}}

  File Type:
  {{fileType}}`,
});

const generateFileNameFlow = ai.defineFlow(
  {
    name: 'generateFileNameFlow',
    inputSchema: GenerateFileNameInputSchema,
    outputSchema: GenerateFileNameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
