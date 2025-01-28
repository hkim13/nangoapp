-- Drop all existing policies
DO $$ 
BEGIN
    -- Drop policies for internal_users
    DROP POLICY IF EXISTS "Basic read access" ON internal_users;
    DROP POLICY IF EXISTS "Self profile management" ON internal_users;
    DROP POLICY IF EXISTS "Super admin access" ON internal_users;
    DROP POLICY IF EXISTS "Admin management" ON internal_users;
    DROP POLICY IF EXISTS "Initial setup" ON internal_users;
    DROP POLICY IF EXISTS "Users can view their own internal profile" ON internal_users;
    DROP POLICY IF EXISTS "Super admins have full access to internal users" ON internal_users;
    DROP POLICY IF EXISTS "Admins can view all internal users" ON internal_users;
    DROP POLICY IF EXISTS "Admins can insert non-admin users" ON internal_users;
    DROP POLICY IF EXISTS "Admins can update non-admin users" ON internal_users;
    DROP POLICY IF EXISTS "Admins can delete non-admin users" ON internal_users;
    DROP POLICY IF EXISTS "Allow first super admin creation" ON internal_users;
    DROP POLICY IF EXISTS "Authenticated users can view internal users" ON internal_users;
    DROP POLICY IF EXISTS "Users can manage their own profile" ON internal_users;
    DROP POLICY IF EXISTS "Super admin full access" ON internal_users;
    DROP POLICY IF EXISTS "Admin access" ON internal_users;
    DROP POLICY IF EXISTS "Initial super admin setup" ON internal_users;
    
    -- Drop policies for external_users
    DROP POLICY IF EXISTS "External self management" ON external_users;
    DROP POLICY IF EXISTS "External user management" ON external_users;
    DROP POLICY IF EXISTS "View own external profile" ON external_users;
    DROP POLICY IF EXISTS "Internal users manage external users" ON external_users;
    DROP POLICY IF EXISTS "Users can view their own external profile" ON external_users;
    DROP POLICY IF EXISTS "Internal users can manage external users" ON external_users;
    
    -- Drop policies for temporary_passwords
    DROP POLICY IF EXISTS "Temporary password creation" ON temporary_passwords;
    DROP POLICY IF EXISTS "Temporary password access" ON temporary_passwords;
    DROP POLICY IF EXISTS "Only internal users can create temporary passwords" ON temporary_passwords;
    DROP POLICY IF EXISTS "Users can view and use their own temporary password" ON temporary_passwords;
END $$;

-- Disable RLS
ALTER TABLE internal_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE external_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE temporary_passwords DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE internal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE temporary_passwords ENABLE ROW LEVEL SECURITY;

-- Create extremely simple policies first to get login working

-- 1. Allow all authenticated users to read internal_users
CREATE POLICY "read_internal_users"
    ON internal_users
    FOR SELECT
    TO authenticated
    USING (true);

-- 2. Allow users to read and update their own profile
CREATE POLICY "manage_own_profile"
    ON internal_users
    FOR ALL
    TO authenticated
    USING (auth_id = auth.uid());

-- 3. Simple external user policies
CREATE POLICY "read_external_users"
    ON external_users
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "manage_own_external_profile"
    ON external_users
    FOR ALL
    TO authenticated
    USING (auth_id = auth.uid());

-- 4. Simple temporary password policies
CREATE POLICY "read_own_temp_password"
    ON temporary_passwords
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "create_temp_password"
    ON temporary_passwords
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
