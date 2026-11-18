-- Optional client Commercial Registration (CR) number on certificates
ALTER TABLE public.translation_certificates
  ADD COLUMN IF NOT EXISTS client_cr_number TEXT,
  ADD COLUMN IF NOT EXISTS show_cr_on_certificate BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.translation_certificates.client_cr_number IS
  'Client CR number when show_cr_on_certificate is true';
COMMENT ON COLUMN public.translation_certificates.show_cr_on_certificate IS
  'When true and client_cr_number is set, CR appears on the PDF';