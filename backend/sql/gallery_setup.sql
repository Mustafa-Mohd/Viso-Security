-- Gallery images (public site /gallery + admin Gallery tab)

CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all access on gallery_images" ON public.gallery_images;
CREATE POLICY "Allow public all access on gallery_images"
    ON public.gallery_images
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- Storage bucket for uploaded gallery / CMS images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public gallery storage read" ON storage.objects;
DROP POLICY IF EXISTS "Public gallery storage write" ON storage.objects;
DROP POLICY IF EXISTS "Allow public all access on gallery bucket" ON storage.objects;

CREATE POLICY "Allow public all access on gallery bucket"
    ON storage.objects
    FOR ALL
    TO public
    USING (bucket_id = 'gallery')
    WITH CHECK (bucket_id = 'gallery');
