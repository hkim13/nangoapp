-- Create enum types for roles and statuses
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'developer');
CREATE TYPE external_user_role AS ENUM ('client', 'premium', 'free');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE subscription_status AS ENUM ('none', 'trial', 'active', 'past_due', 'canceled');

-- Create internal_users table
CREATE TABLE internal_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL,
    status user_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES internal_users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    metadata JSONB,
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create external_users table
CREATE TABLE external_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role external_user_role NOT NULL DEFAULT 'premium',
    company_name TEXT,
    status user_status NOT NULL DEFAULT 'active',
    subscription_status subscription_status NOT NULL DEFAULT 'none',
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES internal_users(id),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    metadata JSONB,
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create client_integrations table
CREATE TABLE client_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES external_users(id) ON DELETE CASCADE,
    integration_type TEXT NOT NULL,
    integration_id TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES internal_users(id),
    UNIQUE(user_id, integration_type, integration_id)
);

-- Create pending_invitations table
CREATE TABLE pending_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    temporary_password TEXT NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('internal', 'external')),
    role TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES internal_users(id),
    metadata JSONB,
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for faster lookups
CREATE INDEX idx_internal_users_email ON internal_users(email);
CREATE INDEX idx_internal_users_role ON internal_users(role);
CREATE INDEX idx_external_users_email ON external_users(email);
CREATE INDEX idx_external_users_role ON external_users(role);
CREATE INDEX idx_external_users_status ON external_users(status);
CREATE INDEX idx_client_integrations_user_id ON client_integrations(user_id);
CREATE INDEX idx_pending_invitations_email ON pending_invitations(email);

-- Create trigger function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_internal_users_updated_at
    BEFORE UPDATE ON internal_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_external_users_updated_at
    BEFORE UPDATE ON external_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
