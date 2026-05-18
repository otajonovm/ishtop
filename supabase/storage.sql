-- Create a storage bucket for documents
-- Note: This is usually done in the Supabase Dashboard, 
-- but here's how you might configure it if using a management API or just documenting it.
-- Create a storage bucket for documents
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- It will create a public bucket named 'documents' and add sensible RLS policies.

-- 1) Create the bucket (make it public)
-- NOTE: Some Supabase projects do not expose a SQL function to create buckets from the SQL Editor.
-- If `SELECT storage.create_bucket(...)` fails with "function does not exist", create the bucket
-- using the Supabase Dashboard instead: Dashboard -> Storage -> Create new bucket -> name it `documents`.
-- After creating the bucket in the Dashboard, run the remaining statements in this file to add policies.

-- 2) Ensure row level security is enabled on storage.objects (should be by default)
ALTER TABLE IF EXISTS storage.objects ENABLE ROW LEVEL SECURITY;

-- 3) Policies for the documents bucket
-- Allow public read access to files in the 'documents' bucket (so getPublicUrl works)
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_policies WHERE polname = 'public_read_documents' AND polrelid = 'storage.objects'::regclass
	) THEN
		CREATE POLICY public_read_documents ON storage.objects FOR SELECT USING (bucket_id = 'documents');
	END IF;
END $$;

-- Allow authenticated users to upload files into the 'documents' bucket
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_policies WHERE polname = 'authenticated_upload_documents' AND polrelid = 'storage.objects'::regclass
	) THEN
		CREATE POLICY authenticated_upload_documents ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
	END IF;
END $$;

-- Quick compatibility: allow uploads from anonymous (frontend using anon key) as well.
-- NOTE: This is less secure. Remove this policy if you want only authenticated users to upload.
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_policies WHERE polname = 'public_upload_documents' AND polrelid = 'storage.objects'::regclass
	) THEN
		CREATE POLICY public_upload_documents ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');
	END IF;
END $$;

-- Allow users to delete their own files
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_policies WHERE polname = 'users_delete_own_documents' AND polrelid = 'storage.objects'::regclass
	) THEN
		CREATE POLICY users_delete_own_documents ON storage.objects FOR DELETE USING (bucket_id = 'documents' AND owner = auth.uid());
	END IF;
END $$;

-- Allow the owner (and admins via existing admin policies) to update metadata if needed
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_policies WHERE polname = 'users_update_own_documents' AND polrelid = 'storage.objects'::regclass
	) THEN
		CREATE POLICY users_update_own_documents ON storage.objects FOR UPDATE USING (bucket_id = 'documents' AND owner = auth.uid());
	END IF;
END $$;

-- Notes:
--  - If you prefer private buckets, set the second param of storage.create_bucket to false and
--    remove/adjust the public_read_documents policy.
--  - After running this, uploads from the frontend (authenticated users) should work and getPublicUrl will return a usable URL.
