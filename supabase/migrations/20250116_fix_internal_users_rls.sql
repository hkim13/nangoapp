-- First, disable RLS temporarily
ALTER TABLE internal_users DISABLE ROW LEVEL SECURITY;

-- Drop existing policies on internal_users
DROP POLICY IF EXISTS "Super admins can do everything with internal users" ON internal_users;
DROP POLICY IF EXISTS "Users can view their own internal user profile" ON internal_users;
DROP POLICY IF EXISTS "Super admins have full access" ON internal_users;
DROP POLICY IF EXISTS "Admins can view all internal users" ON internal_users;

-- Create a simple policy that allows authenticated users to read the table
CREATE POLICY "Allow authenticated read access"
ON internal_users
FOR SELECT
TO authenticated
USING (true);

-- Allow users to view and update their own profile
CREATE POLICY "Users can view and update their own profile"
ON internal_users
FOR ALL
TO authenticated
USING (auth_id = auth.uid())
WITH CHECK (auth_id = auth.uid());

-- Re-enable RLS
ALTER TABLE internal_users ENABLE ROW LEVEL SECURITY;
