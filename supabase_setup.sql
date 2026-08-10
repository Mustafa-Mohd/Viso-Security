-- Create the contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'unread' -- can be 'unread', 'read', 'resolved'
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (anon access)
CREATE POLICY "Allow public insert on contact_submissions" 
    ON public.contact_submissions 
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- Allow authenticated users (admins) to select, update, delete
CREATE POLICY "Allow authenticated full access on contact_submissions" 
    ON public.contact_submissions 
    FOR ALL 
    TO authenticated
    USING (true);
