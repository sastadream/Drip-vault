'use client';

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = 'https://gaeftidfgdxjsnjmrkfn.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhZWZ0aWRmZ2R4anNuam1ya2ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczOTgzNzEsImV4cCI6MjA3Mjk3NDM3MX0.tLG6dZugA5KDOjfj9nPWCjTqwKUkEy15B7iiiCzp0CU';

export const createClient = () => createBrowserClient(supabaseUrl, supabaseAnonKey);
