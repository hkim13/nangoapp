# Nango App Integration

A web application that integrates Nango for managing authentication and external API connections while using Supabase for user login and session management.

## Project Overview

This project uses:
- [Next.js](https://nextjs.org) for the web framework
- [Supabase](https://supabase.com) for authentication and database
- [Nango](https://nango.dev) for OAuth integrations
- [n8n](https://n8n.io) for workflow automation

## Implementation Steps

### Step 1: Authentication and Session Management 

#### 1.1 Supabase Login Configuration
- Implemented user authentication using Supabase Auth
- Created custom session management system with the following features:
  - JWT-based authentication with 1-hour expiration
  - Custom session tracking with 24-hour expiration
  - Automatic session validation and cleanup
  - Row Level Security (RLS) policies for secure data access

**Key Components:**
1. **Database Schema**
   - Created `user_sessions` table with fields:
     - `id`: UUID (Primary Key)
     - `userId`: UUID (References auth.users)
     - `sessionId`: UUID (Unique identifier)
     - `lastActive`: Timestamp
     - `expiresAt`: Timestamp
     - `metadata`: JSONB
     - `createdAt`: Timestamp
     - `updatedAt`: Timestamp

2. **Session Management**
   - Location: `lib/supabase.ts`
   - Functions:
     - `createSession`: Creates new session with 24-hour expiration
     - `getSession`: Retrieves and validates session
     - `updateSessionActivity`: Updates last active timestamp
     - `deleteSession`: Removes specific session
     - `deleteAllUserSessions`: Cleans up all user sessions

3. **Security Features**
   - **Dual-Layer Session Management**:
     - Primary Layer: Supabase JWT (1-hour expiration)
       - Located in Supabase authentication system
       - Automatically refreshed by Supabase
       - Handles core authentication
       - Can be monitored in Supabase Auth dashboard
     
     - Secondary Layer: Custom Sessions (24-hour expiration)
       - Stored in `user_sessions` table
       - Expiration time can be modified in `lib/supabase.ts`:
         ```typescript
         // In createSession function
         const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)
         ```
       - Used for additional session tracking and Nango integration
     
     - Session Synchronization:
       - Both layers must be valid for user access
       - Custom session stores JWT reference in metadata
       - Invalid JWT automatically invalidates custom session
       - Session checks occur on every protected route

   - **Row Level Security (RLS)**:
     - Users can only access their own sessions
     - Policies automatically enforce data isolation
     - SQL policies defined in `supabase/migrations/20250109_create_session_tables.sql`

   - **Automatic Cleanup**:
     - Expired sessions automatically removed
     - Cleanup triggered on session validation
     - Manual cleanup function available: `cleanup_expired_sessions()`

   - **Security Best Practices**:
     - No sensitive data stored in session metadata
     - All database queries use parameterized values
     - Session IDs use cryptographically secure UUIDs
     - Automatic logout on session expiration

4. **UI Components**
   - Enhanced login page with proper error handling and loading states
   - Dashboard with session verification
   - Automatic redirect for unauthenticated users

### Step 2: Integration Management

The application supports multiple third-party integrations (like Airtable, QuickBooks) with a flexible system that can be configured per client.

#### 2.1 Integration Architecture

**Key Components:**
1. **NangoConnect Component** (`components/nango-connect.tsx`)
   - Base component for handling Nango OAuth connections
   - Supports multiple integration types
   - Configuration for each integration type:
     ```typescript
     const INTEGRATION_CONFIGS = {
       airtable: {
         id: 'airtable-gcm8',
         name: 'Airtable',
         buttonText: 'Connect Airtable'
       },
       quickbooks: {
         id: 'quickbooks',
         name: 'QuickBooks',
         buttonText: 'Connect QuickBooks'
       }
     };
     ```

2. **Integration Manager** (`components/integration-manager.tsx`)
   - Manages multiple integration buttons
   - Handles success/error states for each integration
   - Provides consistent UI across all integrations
   - Usage example:
     ```typescript
     <IntegrationManager
       clientId="premium"  // Determines available integrations
       userId={user.id}
       sessionToken={user.id}
     />
     ```

3. **Client Integration Config** (`lib/integration-config.ts`)
   - Defines which integrations are available for each client type
   - Example configuration:
     ```typescript
     const CLIENT_INTEGRATION_CONFIGS = {
       'default': {
         clientId: 'default',
         enabledIntegrations: ['airtable']
       },
       'premium': {
         clientId: 'premium',
         enabledIntegrations: ['airtable', 'quickbooks']
       }
     };
     ```

#### 2.2 Adding New Integrations

To add a new integration type:

1. Update `IntegrationType` in `components/nango-connect.tsx`:
   ```typescript
   export type IntegrationType = 'airtable' | 'quickbooks' | 'your_new_integration';
   ```

2. Add integration config in `components/nango-connect.tsx`:
   ```typescript
   const INTEGRATION_CONFIGS = {
     // ... existing configs ...
     your_new_integration: {
       id: 'your-nango-integration-id',
       name: 'Your Integration Name',
       buttonText: 'Connect to Service'
     }
   };
   ```

3. Add description in `components/integration-manager.tsx`:
   ```typescript
   const INTEGRATION_DESCRIPTIONS = {
     // ... existing descriptions ...
     your_new_integration: 'Description of your integration'
   };
   ```

4. Update client configurations in `lib/integration-config.ts`:
   ```typescript
   const CLIENT_INTEGRATION_CONFIGS = {
     'premium': {
       clientId: 'premium',
       enabledIntegrations: ['airtable', 'quickbooks', 'your_new_integration']
     }
   };
   ```

#### 2.3 Integration Types

Current supported integrations:
- **Airtable** (`airtable-gcm8`)
  - Syncs data from Airtable bases
  - Used for data management and synchronization

- **QuickBooks** (`quickbooks`)
  - Manages financial data and transactions
  - Available in premium client configuration

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Setup

Create a `.env.local` file with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

Run the following SQL in your Supabase SQL Editor to set up the required tables:

```sql
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

-- Add necessary indexes and RLS policies
-- (See full SQL in /supabase/migrations/20250109_create_session_tables.sql)
```

## Next Steps
- [ ] Step 1.2: Session Handling with Nango
- [ ] Step 3: Fetch Data from External APIs
- [ ] Step 4: Display Data in Frontend
- [ ] Step 5: Workflow Integration with n8n

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Nango Documentation](https://docs.nango.dev)
