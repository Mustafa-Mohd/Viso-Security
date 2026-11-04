-- Per-certificate layout (classic = legacy; trilingual | accreditation from VISO-TR-2026-00986+)
ALTER TABLE public.translation_certificates
  ADD COLUMN IF NOT EXISTS template TEXT DEFAULT 'classic';

COMMENT ON COLUMN public.translation_certificates.template IS
  'classic | trilingual | accreditation | official — display uses classic for serials before 2026-00986 regardless.';
