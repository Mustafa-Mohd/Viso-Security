CREATE TABLE IF NOT EXISTS cms_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL,
  old_content JSONB,
  new_content JSONB,
  changed_by TEXT,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE cms_audit_logs DISABLE ROW LEVEL SECURITY;
