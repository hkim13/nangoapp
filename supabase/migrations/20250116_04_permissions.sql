-- Grant schema permissions
GRANT USAGE ON SCHEMA auth TO postgres, authenticated, anon;
GRANT USAGE ON SCHEMA public TO postgres, authenticated, anon;

-- Grant table permissions in auth schema
GRANT SELECT ON auth.users TO authenticated, anon;
GRANT SELECT ON auth.refresh_tokens TO authenticated, anon;

-- Grant permissions in public schema
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT SELECT, INSERT, UPDATE ON public.internal_users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.external_users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.client_integrations TO authenticated;
GRANT SELECT ON public.pending_invitations TO authenticated;

-- Create policy for auth.users
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON auth.users;
CREATE POLICY "Enable read access for authenticated users"
    ON auth.users
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = id
        OR 
        EXISTS (
            SELECT 1 FROM internal_users 
            WHERE auth_id = auth.uid() 
            AND role = 'super_admin'
        )
    );
