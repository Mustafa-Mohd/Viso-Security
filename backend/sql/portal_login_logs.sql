-- Optional dedicated table (app now logs sign-ins via cms_audit_logs section_key = 'portal_login').
-- You do NOT need this file for sign-in activity in Admin Access unless you prefer a separate table.

CREATE TABLE IF NOT EXISTS public.portal_login_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.portal_users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  role TEXT NOT NULL,
  logged_in_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS portal_login_logs_logged_in_at_idx
  ON public.portal_login_logs (logged_in_at DESC);

ALTER TABLE public.portal_login_logs DISABLE ROW LEVEL SECURITY;
