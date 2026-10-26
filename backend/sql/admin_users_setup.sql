-- This function allows the client to securely fetch a list of all registered employees from auth.users
-- Since we use SECURITY DEFINER, it bypasses RLS and can read the protected auth schema.

CREATE OR REPLACE FUNCTION get_all_employees()
RETURNS TABLE (
    id UUID,
    email VARCHAR,
    full_name JSONB,
    created_at TIMESTAMPTZ,
    last_sign_in_at TIMESTAMPTZ
)
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        au.id, 
        au.email::VARCHAR, 
        au.raw_user_meta_data->'full_name', 
        au.created_at, 
        au.last_sign_in_at
    FROM auth.users au
    ORDER BY au.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to the anon and authenticated roles
GRANT EXECUTE ON FUNCTION get_all_employees() TO anon, authenticated;
