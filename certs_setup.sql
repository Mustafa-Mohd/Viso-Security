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

-- 1. Public Read Policy (Anyone can scan the QR code and read the status)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'translation_certificates' AND policyname = 'Allow public read access on translation_certificates') THEN
        CREATE POLICY "Allow public read access on translation_certificates" 
        ON public.translation_certificates 
        FOR SELECT 
        TO public 
        USING (true);
    END IF;
END $$;

-- 2. Authenticated Write Policy (Only authenticated users can insert/update/delete)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'translation_certificates' AND policyname = 'Allow authenticated full access on translation_certificates') THEN
        CREATE POLICY "Allow authenticated full access on translation_certificates" 
        ON public.translation_certificates 
        FOR ALL 
        TO authenticated 
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;
