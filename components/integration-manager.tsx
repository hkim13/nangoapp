'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NangoConnect, IntegrationType } from '@/components/nango-connect';
import { getClientIntegrations } from '@/lib/integration-config';
import { Separator } from "@/components/ui/separator";

interface IntegrationManagerProps {
  clientId: string;
  userId: string;
  sessionToken: string;
}

const INTEGRATION_DESCRIPTIONS: Record<IntegrationType, string> = {
  airtable: 'Connect your Airtable account to sync your data',
  quickbooks: 'Connect QuickBooks to manage your financial data',
  'google-drive': 'Connect your Google Drive account to sync your files',
};

export function IntegrationManager({ clientId, userId, sessionToken }: IntegrationManagerProps) {
  const enabledIntegrations = getClientIntegrations(clientId);

  const handleIntegrationSuccess = (integrationType: IntegrationType) => {
    console.log(`${integrationType} integration connected successfully`);
    // You can add a toast notification or update UI state here
  };

  const handleIntegrationError = (integrationType: IntegrationType, error: Error) => {
    console.error(`${integrationType} integration failed:`, error);
    // You can add a toast notification or error message here
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {enabledIntegrations.map((integrationType, index) => (
            <div key={integrationType}>
              {index > 0 && <Separator className="my-4" />}
              <div>
                <h2 className="text-lg font-semibold mb-2 capitalize">
                  {integrationType} Connection
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {INTEGRATION_DESCRIPTIONS[integrationType]}
                </p>
                <NangoConnect
                  integrationType={integrationType}
                  sessionToken={sessionToken}
                  userId={userId}
                  onSuccess={() => handleIntegrationSuccess(integrationType)}
                  onError={(error) => handleIntegrationError(integrationType, error)}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
