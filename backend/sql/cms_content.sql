CREATE TABLE IF NOT EXISTS cms_content (
  section_key TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable Row Level Security so the admin panel can read/write without complex policies for now
ALTER TABLE cms_content DISABLE ROW LEVEL SECURITY;

-- If you prefer keeping RLS enabled, uncomment these lines instead:
-- ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public all access" ON cms_content FOR ALL USING (true);
