-- Enable RLS on all tables
ALTER TABLE internal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for internal_users
CREATE POLICY "Users can view and update their own profile"
    ON internal_users
    FOR ALL
    TO authenticated
    USING (auth_id = auth.uid())
    WITH CHECK (auth_id = auth.uid());

CREATE POLICY "Super admins have full access to internal users"
    ON internal_users
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM internal_users 
            WHERE auth_id = auth.uid() 
            AND role = 'super_admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM internal_users 
            WHERE auth_id = auth.uid() 
            AND role = 'super_admin'
        )
    );

CREATE POLICY "Admins can view all internal users"
    ON internal_users
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM internal_users 
            WHERE auth_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- RLS Policies for external_users
CREATE POLICY "Users can view their own external profile"
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

CREATE POLICY "Enable insert for signup"
    ON external_users
    FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

-- RLS Policies for client_integrations
CREATE POLICY "Internal users can manage integrations"
    ON client_integrations
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM internal_users WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their own integrations"
    ON client_integrations
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM external_users 
            WHERE auth_id = auth.uid() 
            AND id = client_integrations.user_id
        )
    );

-- RLS Policies for pending_invitations
CREATE POLICY "Only internal users can manage invitations"
    ON pending_invitations
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM internal_users WHERE auth_id = auth.uid()
        )
    );
