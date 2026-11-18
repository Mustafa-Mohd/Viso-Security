-- Remove the old translation certificate *approval* workflow from the database.
-- Safe to run if you never applied approval migrations (uses IF EXISTS).
-- Does NOT touch reviewer emails — those live in CMS (key: translation_certificate_approvers).
-- Run once in Supabase SQL editor after dropping approval code from the app.

-- Ensure every certificate stays visible before removing publish_status (if column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'translation_certificates'
      AND column_name = 'publish_status'
  ) THEN
    UPDATE public.translation_certificates
    SET publish_status = 'published'
    WHERE publish_status IS NOT NULL AND publish_status <> 'published';
  END IF;
END $$;

DROP TABLE IF EXISTS public.certificate_approvals;

ALTER TABLE public.translation_certificates
  DROP CONSTRAINT IF EXISTS translation_certificates_publish_status_check;

ALTER TABLE public.translation_certificates
  DROP COLUMN IF EXISTS publish_status;