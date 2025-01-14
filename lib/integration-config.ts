import { IntegrationType } from '@/components/nango-connect';

export interface ClientIntegrationConfig {
  clientId: string;
  enabledIntegrations: IntegrationType[];
}

// This could be moved to a database table later
export const CLIENT_INTEGRATION_CONFIGS: Record<string, ClientIntegrationConfig> = {
  'default': {
    clientId: 'default',
    enabledIntegrations: ['airtable']
  },
  'premium': {
    clientId: 'premium',
    enabledIntegrations: ['airtable', 'quickbooks']
  }
};

export function getClientIntegrations(clientId: string): IntegrationType[] {
  return CLIENT_INTEGRATION_CONFIGS[clientId]?.enabledIntegrations || 
         CLIENT_INTEGRATION_CONFIGS['default'].enabledIntegrations;
}
