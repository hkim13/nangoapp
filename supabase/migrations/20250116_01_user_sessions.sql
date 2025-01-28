-- Create user_sessions table
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    "sessionId" UUID NOT NULL UNIQUE,
    "lastActive" TIMESTAMP WITH TIME ZONE NOT NULL,
    "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    metadata JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_user_sessions_user_id ON user_sessions("userId");
CREATE INDEX idx_user_sessions_session_id ON user_sessions("sessionId");

-- Enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own sessions
CREATE POLICY "Users can read their own sessions"
    ON user_sessions FOR SELECT
    USING (auth.uid() = "userId");

-- Policy for users to insert their own sessions
CREATE POLICY "Users can insert their own sessions"
    ON user_sessions FOR INSERT
    WITH CHECK (auth.uid() = "userId");

-- Policy for users to update their own sessions
CREATE POLICY "Users can update their own sessions"
    ON user_sessions FOR UPDATE
    USING (auth.uid() = "userId")
    WITH CHECK (auth.uid() = "userId");

-- Policy for users to delete their own sessions
CREATE POLICY "Users can delete their own sessions"
    ON user_sessions FOR DELETE
    USING (auth.uid() = "userId");

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM user_sessions
    WHERE "expiresAt" < NOW();
END;
$$;
