# **App Name**: EduVault

## Core Features:

- User Authentication: Secure signup and login using email/password, with enforced password requirements and email verification.
- Department Selection: UI to select a department from a predefined list.
- Semester Selection: UI to select a semester (Sem-1 to Sem-8).
- Subject Selection: Dynamically fetch and display subjects from the database based on department and semester selections.
- File Upload: Allow users to upload files (PDF, DOCX, PPTX, PNG, JPG) to Supabase storage with file size limits (20MB) and structured paths. Stores the file url into a files table with other relevant metadata
- File Listing and Preview: List all uploaded files for a specific subject with options to preview (PDFs) and download. PDF previews utilize <iframe> or public Supabase URLs.
- Intelligent File Name Generation: Uses AI to generate descriptive file names based on the document's content, improving discoverability and organization as a tool.

## Style Guidelines:

- Primary color: Slate blue (#708090) to convey trust and stability, reflecting the academic focus.
- Background color: Light gray (#F0F8FF) to provide a clean and neutral backdrop.
- Accent color: Steel blue (#4682B4) to highlight interactive elements.
- Body and headline font: 'Inter', a sans-serif, for a modern, neutral, machined aesthetic; for both headlines and body text
- Use consistent, clear icons from a library like FontAwesome or Material Icons to represent file types and actions.
- Implement a responsive grid layout with department/semester cards and clear file lists. Use Tailwind CSS for spacing and alignment.
- Subtle hover effects on department/semester cards and buttons to enhance user interaction.