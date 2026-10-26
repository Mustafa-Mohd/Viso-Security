-- EDMS Tables Setup

-- 1. Create a storage bucket for EDMS files if it doesn't exist
-- Requires supersuser or dashboard access, so we use SQL for storage.buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('edms_files', 'edms_files', false)
ON CONFLICT (id) DO NOTHING;

-- Note: RLS policies on storage.objects need to be created if not exists.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow public full access to edms_files'
    ) THEN
        CREATE POLICY "Allow public full access to edms_files"
            ON storage.objects FOR ALL TO public
            USING (bucket_id = 'edms_files')
            WITH CHECK (bucket_id = 'edms_files');
    END IF;
END $$;


-- 2. Update portal_users role constraint
ALTER TABLE public.portal_users DROP CONSTRAINT IF EXISTS portal_users_role_check;
ALTER TABLE public.portal_users ADD CONSTRAINT portal_users_role_check 
    CHECK (role IN ('super_admin', 'admin', 'hr', 'employee', 'document_controller', 'manager', 'reviewer', 'viewer'));

-- 3. edms_documents table
CREATE TABLE IF NOT EXISTS public.edms_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_number TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- e.g., Report, Drawings, Specifications, Contract
    department TEXT NOT NULL,
    project TEXT NOT NULL,
    description TEXT,
    tags TEXT,
    confidentiality TEXT DEFAULT 'Internal', -- Public, Internal, Confidential
    status TEXT DEFAULT 'Draft', -- Draft, Submitted, Under Review, Changes Requested, Approved, Rejected, Archived
    owner_name TEXT NOT NULL,
    owner_id UUID REFERENCES public.portal_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional columns for review workflow (safe to re-run)
ALTER TABLE public.edms_documents ADD COLUMN IF NOT EXISTS assigned_reviewer_id UUID REFERENCES public.portal_users(id) ON DELETE SET NULL;
ALTER TABLE public.edms_documents ADD COLUMN IF NOT EXISTS assigned_reviewer_name TEXT;
ALTER TABLE public.edms_documents ADD COLUMN IF NOT EXISTS review_notes TEXT;

-- 4. edms_document_versions table
CREATE TABLE IF NOT EXISTS public.edms_document_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES public.edms_documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_url TEXT NOT NULL, -- Path in Supabase storage
    created_by_name TEXT NOT NULL,
    created_by_id UUID REFERENCES public.portal_users(id) ON DELETE SET NULL,
    change_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(document_id, version_number)
);

-- 5. edms_audit_logs table
CREATE TABLE IF NOT EXISTS public.edms_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES public.edms_documents(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_id UUID REFERENCES public.portal_users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure RLS is enabled and set up policies
ALTER TABLE public.edms_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edms_document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edms_audit_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'edms_documents' AND policyname = 'Allow full access on edms_documents') THEN
        CREATE POLICY "Allow full access on edms_documents" ON public.edms_documents FOR ALL TO public USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'edms_document_versions' AND policyname = 'Allow full access on edms_document_versions') THEN
        CREATE POLICY "Allow full access on edms_document_versions" ON public.edms_document_versions FOR ALL TO public USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'edms_audit_logs' AND policyname = 'Allow full access on edms_audit_logs') THEN
        CREATE POLICY "Allow full access on edms_audit_logs" ON public.edms_audit_logs FOR ALL TO public USING (true);
    END IF;
END $$;

-- 6. Add test users for EDMS roles
INSERT INTO public.portal_users (name, email, password, role, department, grade)
VALUES 
    ('Manager Test', 'manager@visogroup.com', 'viso123', 'manager', 'Operations', 'Senior'),
    ('Reviewer Test', 'reviewer@visogroup.com', 'viso123', 'reviewer', 'Engineering', 'Professional'),
    ('Employee Test', 'employee@visogroup.com', 'viso123', 'employee', 'IT', 'Professional')
ON CONFLICT (email) DO NOTHING;
