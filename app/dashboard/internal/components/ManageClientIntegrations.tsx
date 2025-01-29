'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

type Integration = {
  integration_type: string;
  integration_id: string;
  display_name: string;
};

type ClientIntegration = {
  integration_type: string;
  integration_id: string;
  enabled: boolean;
};

export default function ManageClientIntegrations({ userEmail }: { userEmail: string }) {
  const [availableIntegrations] = useState<Integration[]>([
    { integration_type: 'airtable', integration_id: 'airtable', display_name: 'Airtable' },
    { integration_type: 'quickbooks', integration_id: 'quickbooks', display_name: 'QuickBooks' },
    { integration_type: 'google-drive', integration_id: 'google-drive', display_name: 'Google Drive' }
  ]);
  const [clientIntegrations, setClientIntegrations] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadIntegrations();
  }, [userEmail]);

  const loadIntegrations = async () => {
    try {
      // Get user's ID first
      const { data: userData, error: userError } = await supabase
        .from('external_users')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (userError) throw userError;

      // Get user's current integrations
      const { data: userIntegrations, error: intError } = await supabase
        .from('client_integrations')
        .select('integration_type, integration_id, enabled')
        .eq('user_id', userData.id);

      if (intError) throw intError;

      // Create a map of integration_type to enabled status
      const enabledMap = userIntegrations?.reduce((acc: { [key: string]: boolean }, curr: ClientIntegration) => {
        acc[curr.integration_type] = curr.enabled;
        return acc;
      }, {});

      setClientIntegrations(enabledMap || {});
    } catch (error) {
      console.error('Error loading integrations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load integrations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleIntegration = async (integration: Integration) => {
    try {
      const newStatus = !clientIntegrations[integration.integration_type];

      // Get user's ID
      const { data: userData, error: userError } = await supabase
        .from('external_users')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (userError) throw userError;

      // Get admin's ID
      const { data: { session } } = await supabase.auth.getSession();
      const { data: adminData, error: adminError } = await supabase
        .from('internal_users')
        .select('id')
        .eq('auth_id', session?.user.id)
        .single();

      if (adminError) throw adminError;

      // Update or insert the integration
      const { error: updateError } = await supabase
        .from('client_integrations')
        .upsert({
          user_id: userData.id,
          integration_type: integration.integration_type,
          integration_id: integration.integration_id,
          enabled: newStatus,
          created_by: adminData.id
        }, {
          onConflict: 'user_id,integration_type,integration_id'
        });

      if (updateError) throw updateError;

      setClientIntegrations(prev => ({
        ...prev,
        [integration.integration_type]: newStatus,
      }));

      toast({
        title: 'Success',
        description: `${integration.display_name} ${newStatus ? 'enabled' : 'disabled'} for user`,
      });
    } catch (error) {
      console.error('Error toggling integration:', error);
      toast({
        title: 'Error',
        description: 'Failed to update integration status',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Client Integrations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {availableIntegrations.map(integration => (
            <div
              key={integration.integration_type}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-medium">{integration.display_name}</h3>
                <p className="text-sm text-gray-500">
                  {clientIntegrations[integration.integration_type] 
                    ? 'Currently enabled for this user' 
                    : 'Not enabled for this user'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={clientIntegrations[integration.integration_type] || false}
                  onChange={() => toggleIntegration(integration)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
