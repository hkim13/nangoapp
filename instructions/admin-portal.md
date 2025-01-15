# Admin Portal and User Management System

## Overview
This document outlines the architecture and implementation details for the admin portal and user management system. The system distinguishes between internal and external users, each with their own roles, permissions, and dedicated interfaces.

## User Types and Roles

### Internal Users
Internal users are company employees with administrative privileges.

#### Roles:
1. **Super Admin**
   - Can perform all admin actions
   - Create and manage admin accounts
   - Full system access

2. **Admin**
   - Create and manage developer accounts
   - Create and manage external accounts (all types)
   - Assign integrations to client accounts
   - View and manage client integrations

3. **Developer**
   - Role permissions to be determined
   - Limited administrative access

### External Users
External users are clients and potential customers using the platform.

#### Roles:
1. **Client**
   - Primary external user type
   - Access to assigned integrations
   - Custom integration configurations

2. **Premium**
   - Future commercial tier
   - Enhanced features (to be determined)

3. **Free**
   - Future commercial tier
   - Basic features (to be determined)

## Database Schema

### Tables Required:
1. **internal_users**
   ```sql
   - id (uuid, primary key)
   - email (string, unique)
   - role (enum: super_admin, admin, developer)
   - status (enum: active, inactive, suspended)
   - created_at (timestamp)
   - created_by (uuid, references internal_users.id)
   - updated_at (timestamp)
   - metadata (jsonb)
   ```

2. **external_users**
   ```sql
   - id (uuid, primary key)
   - email (string, unique)
   - role (enum: client, premium, free)
   - company_name (string, nullable)
   - status (enum: active, inactive, suspended)
   - subscription_status (enum: none, trial, active, past_due, canceled)
   - subscription_end_date (timestamp, nullable)
   - created_at (timestamp)
   - created_by (uuid, references internal_users.id)
   - updated_at (timestamp)
   - metadata (jsonb)
   ```

3. **client_integrations**
   ```sql
   - id (uuid, primary key)
   - user_id (uuid, references external_users.id)
   - integration_type (string)
   - integration_id (string)
   - enabled (boolean)
   - created_at (timestamp)
   - created_by (uuid, references internal_users.id)
   ```

4. **pending_invitations**
   ```sql
   - id (uuid, primary key)
   - email (string)
   - temporary_password (string, hashed)
   - user_type (enum: internal, external)
   - role (string)
   - expires_at (timestamp)
   - created_at (timestamp)
   - created_by (uuid, references internal_users.id)
   - metadata (jsonb)
   ```

## User Flows

### Client Account Creation Flow
1. Admin creates new client account:
   - Provides client email
   - Assigns necessary integrations
   - System generates temporary password
   
2. System actions:
   - Creates user record in external_users table
   - Creates integration assignments in client_integrations
   - Creates invitation record with temporary password
   - Sends invitation email with temporary credentials

3. Client onboarding:
   - Client clicks invitation link
   - Redirected to password reset page (email pre-filled)
   - Sets new password
   - Password updated in Supabase
   - Redirected to client dashboard

### Integration Management
1. Admin assigns integrations:
   - Selects client account
   - Chooses integration types
   - Configures integration IDs
   - Enables/disables integrations

2. Client integration access:
   - Client sees only assigned integrations
   - Uses Nango frontend SDK for connection
   - Integration status tracked in client_integrations

## User Interfaces

### Admin Portal
1. Dashboard views:
   - User management interface
   - Integration management
   - Account status overview
   - Activity logs

2. User management features:
   - Create/edit/delete users
   - Role assignment
   - Status management
   - Integration assignment

### External User Dashboard
1. Features:
   - View assigned integrations
   - Connect using Nango SDK
   - Manage integration settings
   - View integration status

## Security Considerations
- Role-based access control (RBAC)
- Secure password handling
- Invitation link expiration
- Session management
- Audit logging

## Implementation Phases
1. Database setup
2. Authentication system
3. Admin portal development
4. External dashboard modifications
5. Integration management
6. Email notification system
7. Testing and security audit

## Future Considerations
- Additional role types
- Enhanced developer permissions
- Commercial tier features
- Advanced integration options
