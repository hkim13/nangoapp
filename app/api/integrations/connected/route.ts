import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's ID from external_users table
    const { data: userData, error: userError } = await supabase
      .from('external_users')
      .select('id')
      .eq('auth_id', session.user.id)
      .single();

    if (userError) {
      throw userError;
    }

    // Get user's connected integrations
    const { data: integrations, error: integrationsError } = await supabase
      .from('client_integrations')
      .select('integration_type')
      .eq('user_id', userData.id)
      .eq('enabled', true);

    if (integrationsError) {
      throw integrationsError;
    }

    // Transform the data to return just the integration types
    const connectedIntegrations = integrations.map(int => int.integration_type);

    return NextResponse.json({
      integrations: connectedIntegrations
    });

  } catch (error) {
    console.error('Error fetching connected integrations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
