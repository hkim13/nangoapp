# Seamless AI Integration Platform

> ⚠️ **Note**: This project is being prepared for public release. Some cleanup and simplification is required before production use.

A modern web application that seamlessly connects various SaaS platforms using Next.js, Supabase, and Nango. Currently supports integrations with Google Drive, Airtable, and Slack, with an extensible architecture for adding more integrations.

## 🚀 Features

- **Authentication & Session Management**: Secure user authentication via Supabase
- **OAuth Integrations**: Easy connection to third-party services using Nango
- **File Processing**: Automated file handling with Google Drive integration
- **Workflow Automation**: n8n integration for automated workflows
- **Modern UI**: Clean, responsive interface built with Tailwind CSS

## ⚠️ Pre-Release Cleanup Required

Before using this in production, please note the following areas that need attention:

1. **User Types Simplification**
   - Current implementation includes multiple user types (client/premium/free)
   - Needs to be simplified to a single user type for public release
   - Affected files:
     - `supabase/migrations/20250116_02_user_management.sql`
     - `app/dashboard/(external-users)/*`
     - `lib/integration-config.ts`

2. **Supabase Configuration**
   - Current setup includes complex RLS policies for multiple user types
   - Needs streamlining for simpler deployment
   - Review `supabase/migrations/` for necessary adjustments

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account
- Nango account
- n8n instance (for workflow automation)

### Environment Variables

Create a `.env.local` file with the following:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Nango Configuration
NEXT_PUBLIC_NANGO_PUBLIC_KEY=your_nango_public_key
NEXT_PUBLIC_NANGO_HOST=https://api.nango.dev
NANGO_SECRET_KEY=your_nango_secret_key

# Google Drive Integration
NEXT_PUBLIC_GOOGLE_APP_ID=your_google_app_id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_PICKER_API_KEY=your_google_picker_api_key

# n8n Webhook URLs
NEXT_PUBLIC_N8N_WEBHOOK_URL=your_n8n_webhook_url
NEXT_PUBLIC_GOOGLE_DRIVE_WEBHOOK_URL=your_google_drive_webhook_url
```

### Database Setup

1. Create a new Supabase project
2. Run the following base schema (simplified version):

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

-- Add RLS policies
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own sessions"
    ON user_sessions
    FOR ALL
    USING ("userId" = auth.uid());
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/seamless-ai.git

# Install dependencies
npm install

# Run development server
npm run dev
```

## 🔌 Supported Integrations

Currently supports:
- **Google Drive**: Document management and processing
- **Airtable**: Data synchronization
- **Slack**: Communication integration

Each integration uses Nango for OAuth handling and n8n for workflow automation.

## 🏗️ Architecture

### Key Components

1. **Authentication Flow**
   - Supabase handles user authentication
   - Custom session management with 24-hour expiration
   - JWT-based authentication with automatic refresh

2. **Integration Management**
   - Nango handles OAuth connections
   - Centralized integration configuration
   - Extensible integration system

3. **File Processing**
   - Google Drive Picker integration
   - Server-side file processing
   - n8n webhook integration for automation

## 🚧 Known Issues and Limitations

1. **User Type System**
   - Currently implements a complex multi-tier user system
   - Will be simplified to single user type in future release

2. **Integration Permissions**
   - Integration access is tied to user types
   - Needs refactoring for simpler permission model

3. **Session Management**
   - Complex dual-layer session system
   - May be simplified in future releases

## 📝 Contributing

This project is being prepared for public release. Contributions will be welcome after initial cleanup is complete.

## 📄 License

MIT License - See LICENSE file for details

---

> 🔍 **Note**: This is a pre-release version. Please ensure you understand the cleanup requirements before deploying to production.
