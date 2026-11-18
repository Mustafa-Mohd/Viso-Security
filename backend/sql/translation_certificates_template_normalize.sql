-- Optional: map retired templates to official (after removing trilingual / accreditation from admin).
UPDATE public.translation_certificates
SET template = 'official'
WHERE template IN ('trilingual', 'accreditation');