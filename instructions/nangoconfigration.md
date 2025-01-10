# Nango Sample App Setup Instructions

This guide explains how to set up and configure the Nango sample application, including both frontend and backend components.

## Project Structure

```
nango-sample-app/
├── front-end/         # React/Next.js frontend application
├── back-end/          # Node.js backend server
├── nango-integrations/# Nango integration configurations
└── docker-compose.yaml# Development environment setup
```

## Prerequisites

- Node.js (version specified in .nvmrc)
- Docker and Docker Compose
- A Nango account with API credentials

## Environment Setup

1. Create a `.env` file in the root directory based on `.env.example`:
```env
NANGO_SECRET_KEY=your_nango_secret_key
NANGO_HOST=https://api.nango.dev  # Or your self-hosted instance
```

## Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Nango in the backend:
- The backend uses `@nangohq/node` SDK
- Configuration is in `back-end/src/nango.ts`:
```typescript
import { Nango } from '@nangohq/node';

export const nango = new Nango({
  host: process.env['NANGO_HOST'] ?? 'https://api.nango.dev',
  secretKey: process.env['NANGO_SECRET_KEY']!,
});
```

## Frontend Setup

1. Install the Nango frontend SDK:
```bash
npm install @nangohq/frontend
```

2. Initialize the Nango client in your frontend application:
```typescript
import { createNango } from '@nangohq/frontend';

const nango = createNango({
  publicKey: 'YOUR_PUBLIC_KEY',
  // Optional: customize the host if you're self-hosting
  host: 'https://api.nango.dev'
});
```

3. Implement OAuth connection flow:
```typescript
// Create a connection
const connectionId = 'unique-connection-id';
await nango.auth('PROVIDER-NAME', connectionId);

// Get connection status
const connection = await nango.getConnection('PROVIDER-NAME', connectionId);
```

## API Endpoints

The backend provides the following endpoints:

- `POST /connect-session`: Creates new connection sessions
- `GET /integrations`: Lists available integrations
- `GET /connections`: Retrieves connection states
- `GET /contacts`: Retrieves contacts (configured for Slack in this example)

## Running the Application

1. Start the development environment:
```bash
npm run dev
```

This command will:
- Start Docker containers (via docker-compose)
- Run the frontend development server
- Run the backend development server

2. Access the application:
- Frontend: http://localhost:3000
- Backend: http://localhost:3010

## Integration Configuration

The sample app comes pre-configured for Slack integration. To add more integrations:

1. Create new integration configurations in the `nango-integrations` directory
2. Update the backend routes in `back-end/src/routes`
3. Add corresponding frontend components in `front-end/src/components`

## Troubleshooting

1. If you encounter connection issues:
   - Verify your Nango credentials in the `.env` file
   - Check that all services are running (`docker ps`)
   - Ensure ports 3000 and 3010 are available

2. For OAuth issues:
   - Verify your OAuth callback URLs are correctly configured
   - Check the browser console for any CORS issues
   - Ensure your Nango public key matches your secret key

## Security Considerations

1. Never commit your `.env` file
2. Keep your Nango secret key secure
3. Always use environment variables for sensitive configuration
4. Implement proper error handling for API responses

## Additional Resources

- [Nango Documentation](https://docs.nango.dev/)
- [API Reference](https://docs.nango.dev/api-reference/)
- [Integration Guides](https://docs.nango.dev/integrations/)
