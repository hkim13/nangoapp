'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from '@/lib/supabase'
import { NangoConnect, type IntegrationType } from '@/components/nango-connect'
import { useToast } from '@/components/ui/use-toast'

type Integration = {
  integration_type: string
  integration_id: string
  enabled: boolean
}

export default function ClientDashboard() {
  const [userIntegrations, setUserIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [sessionToken, setSessionToken] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const { toast } = useToast()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      setSessionToken(session.access_token)
      setUserId(session.user.id)

      // Get user's ID first
      const { data: userData, error: userError } = await supabase
        .from('external_users')
        .select('id')
        .eq('auth_id', session.user.id)
        .single()

      if (userError) throw userError

      // Get user's enabled integrations
      const { data: integrations, error: intError } = await supabase
        .from('client_integrations')
        .select('*')
        .eq('user_id', userData.id)
        .eq('enabled', true)

      if (intError) throw intError

      setUserIntegrations(integrations || [])
    } catch (error) {
      console.error('Error loading integrations:', error)
      toast({
        title: 'Error',
        description: 'Failed to load your integrations',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = (integrationType: string) => {
    toast({
      title: 'Success',
      description: `Successfully connected to ${integrationType}`,
    })
  }

  const handleError = (integrationType: string, error: Error) => {
    toast({
      title: 'Error',
      description: `Failed to connect to ${integrationType}: ${error.message}`,
      variant: 'destructive',
    })
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userIntegrations.length === 0 ? (
              <p className="text-muted-foreground">No integrations are currently enabled for your account.</p>
            ) : (
              userIntegrations.map(integration => (
                <div key={integration.integration_type} className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">
                    {integration.integration_type.charAt(0).toUpperCase() + 
                     integration.integration_type.slice(1)}
                  </h3>
                  <NangoConnect
                    integrationType={integration.integration_type as IntegrationType}
                    sessionToken={sessionToken}
                    userId={userId}
                    onSuccess={() => handleSuccess(integration.integration_type)}
                    onError={(error) => handleError(integration.integration_type, error)}
                  />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
