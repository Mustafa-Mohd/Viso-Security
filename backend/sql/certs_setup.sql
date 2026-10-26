-- VISO Translation Certificates Setup

CREATE TABLE IF NOT EXISTS public.translation_certificates (
    id TEXT PRIMARY KEY, -- e.g., VISO-TR-2026-001245
    national_id TEXT NOT NULL,
    project_name TEXT NOT NULL,
    source_lang TEXT NOT NULL,
    target_lang TEXT NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'VALID', -- VALID, EXPIRED, REVOKED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.translation_certificates ENABLE ROW LEVEL SECURITY;

-- Public read (Certipedia verification) + admin writes via anon key (portal login, not Supabase Auth).
DROP POLICY IF EXISTS "Allow public read access on translation_certificates" ON public.translation_certificates;
DROP POLICY IF EXISTS "Allow authenticated full access on translation_certificates" ON public.translation_certificates;
DROP POLICY IF EXISTS "Allow public full access on translation_certificates" ON public.translation_certificates;

CREATE POLICY "Allow public full access on translation_certificates"
    ON public.translation_certificates
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- Existing projects: run certs_rls_fix.sql if you already applied the old authenticated-only write policy.
