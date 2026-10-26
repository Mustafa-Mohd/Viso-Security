-- Setup for core_values table in Supabase
CREATE TABLE IF NOT EXISTS public.core_values (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    "desc" TEXT,
    points TEXT[] DEFAULT '{}'::text[],
    "imageUrl" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.core_values ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all access on core_values" ON public.core_values;

CREATE POLICY "Allow public all access on core_values"
    ON public.core_values
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);
