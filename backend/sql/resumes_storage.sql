-- Resumes storage bucket for career PDF uploads
-- Run this in the Supabase SQL editor

INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public uploads (same pattern as public career form → anon key)
DROP POLICY IF EXISTS "Public can upload resumes" ON storage.objects;
CREATE POLICY "Public can upload resumes"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Public can read resumes" ON storage.objects;
CREATE POLICY "Public can read resumes"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'resumes');

-- Ensure resume_url column exists on job_applications
ALTER TABLE job_applications
ADD COLUMN IF NOT EXISTS resume_url TEXT;
