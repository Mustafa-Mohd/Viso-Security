-- SQL script to create the job_applications table

CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  position TEXT NOT NULL,
  cover_letter TEXT,
  resume_url TEXT,
  status TEXT DEFAULT 'New',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Fix for Row Level Security (RLS) blocking public submissions
ALTER TABLE job_applications DISABLE ROW LEVEL SECURITY;

-- If you prefer keeping RLS enabled, uncomment the lines below instead of disabling it:
-- ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public all access" ON job_applications FOR ALL USING (true);

-- Also run resumes_storage.sql to create the public "resumes" storage bucket for PDF uploads.
