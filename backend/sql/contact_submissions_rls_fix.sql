-- Run in Supabase SQL Editor if Admin → Inquiries is empty but /contact works.
-- Admin uses anon key + portal_users (not Supabase Auth).

CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'unread'
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated full access on contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow public all access on contact_submissions" ON public.contact_submissions;

CREATE POLICY "Allow public all access on contact_submissions"
    ON public.contact_submissions
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);
