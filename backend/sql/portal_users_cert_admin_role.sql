-- Certificate-only admin portal role (Certificates + CMS audit history in admin UI)
ALTER TABLE public.portal_users DROP CONSTRAINT IF EXISTS portal_users_role_check;
ALTER TABLE public.portal_users ADD CONSTRAINT portal_users_role_check
  CHECK (role IN (
    'super_admin',
    'admin',
    'cert_admin',
    'hr',
    'employee',
    'document_controller',
    'manager',
    'reviewer',
    'viewer'
  ));
