-- SQL script to create the portal_users table for Role-Based Access Control

CREATE TABLE IF NOT EXISTS portal_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'hr', 'employee', 'document_controller')),
  department TEXT,
  grade TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Fix for Row Level Security (RLS) blocking the login
ALTER TABLE portal_users DISABLE ROW LEVEL SECURITY;

-- If you prefer keeping RLS enabled, uncomment the lines below instead of disabling it:
-- ALTER TABLE portal_users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public all access" ON portal_users FOR ALL USING (true);

-- Insert a default Super Admin account so you can log into the Admin panel to create other users.
INSERT INTO portal_users (name, email, password, role, department, grade)
VALUES ('System Admin', 'superadmin@visogroup.com', 'admin123', 'super_admin', 'Management', 'Executive')
ON CONFLICT (email) DO NOTHING;
