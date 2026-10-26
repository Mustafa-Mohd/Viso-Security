-- Create the storage bucket for avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    5242880, -- 5MB limit
    '{image/jpeg,image/png,image/gif,image/webp}'
)
ON CONFLICT (id) DO UPDATE SET 
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Policy to allow anyone to read avatars (since it's a public bucket, this helps for fetching)
CREATE POLICY "Avatar images are publicly accessible."
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Policy to allow authenticated users to upload their own avatars
-- We check that the filename starts with their user ID
CREATE POLICY "Users can upload their own avatar."
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'avatars' 
    AND (auth.uid())::text = (string_to_array(name, '-'))[1]
);

-- Policy to allow users to update their own avatar
CREATE POLICY "Users can update their own avatar."
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'avatars' 
    AND (auth.uid())::text = (string_to_array(name, '-'))[1]
);

-- Policy to allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar."
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'avatars' 
    AND (auth.uid())::text = (string_to_array(name, '-'))[1]
);
