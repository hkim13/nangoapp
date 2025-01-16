-- Drop existing policies for external_users
DROP POLICY IF EXISTS "Internal users can manage external users" ON external_users;
DROP POLICY IF EXISTS "Users can view their own external user profile" ON external_users;

-- Create new policies for external_users
CREATE POLICY "Enable insert for authenticated users during signup"
    ON external_users
    FOR INSERT
    TO authenticated
    WITH CHECK (true);  -- Allow any authenticated user to insert their own record

CREATE POLICY "Users can view their own external user profile"
    ON external_users
    FOR SELECT
    TO authenticated
    USING (auth_id = auth.uid());

CREATE POLICY "Internal users can manage external users"
    ON external_users
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM internal_users WHERE auth_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM internal_users WHERE auth_id = auth.uid()
        )
    );

-- Enable anon access for initial signup
CREATE POLICY "Enable insert for anonymous users during signup"
    ON external_users
    FOR INSERT
    TO anon
    WITH CHECK (true);  -- Allow anonymous users to insert during signup
