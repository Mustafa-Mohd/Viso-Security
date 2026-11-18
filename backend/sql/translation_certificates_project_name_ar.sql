-- Arabic client line for Simple certificates when Arabic is source or target language
ALTER TABLE public.translation_certificates
  ADD COLUMN IF NOT EXISTS project_name_ar TEXT;

COMMENT ON COLUMN public.translation_certificates.project_name_ar IS
  'Arabic client name as printed on Simple template (e.g. مايا، ابنة السيد …)';