-- Run in Supabase SQL Editor if certificate create/update/delete returns 401/403 from admin.
-- Admin uses portal_users + anon key (not Supabase Auth), so writes must be allowed for public/anon.

DROP POLICY IF EXISTS "Allow public read access on translation_certificates" ON public.translation_certificates;
DROP POLICY IF EXISTS "Allow authenticated full access on translation_certificates" ON public.translation_certificates;
DROP POLICY IF EXISTS "Allow public full access on translation_certificates" ON public.translation_certificates;

CREATE POLICY "Allow public full access on translation_certificates"
    ON public.translation_certificates
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);
