'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { NangoConnect, IntegrationType } from '@/components/nango-connect'

const integrations = [
  {
    name: 'Google Drive',
    description: 'Connect your Google Drive account to manage files and folders.',
    type: 'google-drive' as IntegrationType,
    icon: (
      <svg viewBox="0 0 87.3 78" className="w-10 h-10">
        <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
        <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
        <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
        <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
        <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
        <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
      </svg>
    ),
    status: 'Available'
  },
  {
    name: 'Airtable',
    description: 'Integrate with Airtable to sync and manage your data.',
    type: 'airtable' as IntegrationType,
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10">
        <path d="M14.054 24.177L2.292 18.658c-1.145-.536-2.292.268-2.292 1.34v12.041c0 .804.536 1.609 1.341 1.877l11.762 5.519c1.146.536 2.292-.268 2.292-1.341V26.053c0-.804-.536-1.609-1.341-1.876z" fill="#F06292"/>
        <path d="M25.947 24.177l11.762-5.519c1.145-.536 2.292.268 2.292 1.34v12.041c0 .804-.536 1.609-1.341 1.877l-11.762 5.519c-1.146.536-2.292-.268-2.292-1.341V26.053c0-.804.536-1.609 1.341-1.876z" fill="#EC407A"/>
        <path d="M20 2.292L31.762 7.81c.804.268 1.341 1.073 1.341 1.877v12.041c0 1.073-1.146 1.877-2.292 1.341L19.049 17.55c-.804-.268-1.341-1.073-1.341-1.877V3.633c0-1.073 1.146-1.877 2.292-1.341z" fill="#E91E63"/>
      </svg>
    ),
    status: 'Available'
  },
  {
    name: 'QuickBooks',
    description: 'Connect to QuickBooks for financial management and accounting.',
    type: 'quickbooks' as IntegrationType,
    icon: (
      <svg viewBox="0 0 125 125" className="w-10 h-10" fill="none">
        <path d="M62.5 0C27.9822 0 0 27.9822 0 62.5C0 97.0178 27.9822 125 62.5 125C97.0178 125 125 97.0178 125 62.5C125 27.9822 97.0178 0 62.5 0Z" fill="#2CA01C"/>
        <path d="M62.5 16.5C36.8 16.5 16.5 36.8 16.5 62.5C16.5 88.2 36.8 108.5 62.5 108.5C88.2 108.5 108.5 88.2 108.5 62.5H62.5V16.5Z" fill="white"/>
      </svg>
    ),
    status: 'Available'
  }
]

export default function Dashboard() {
  const router = useRouter()
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.log('No user found, redirecting to login')
        router.push('/auth/login')
        return
      }

      setSessionToken(session?.access_token || null)
      setUserId(user.id)
    }

    checkUser()
  }, [router])

  const handleIntegrationSuccess = (result: { connectionId?: string; fileIds?: string[] }) => {
    console.log('Integration successful:', result)
    // You can add additional logic here, like showing a success message
  }

  const handleIntegrationError = (error: Error) => {
    console.error('Integration error:', error)
    // You can add error handling logic here
  }

  if (!sessionToken || !userId) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Available Integrations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.name} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  {integration.icon}
                </div>
                <div>
                  <CardTitle>{integration.name}</CardTitle>
                  <CardDescription className="text-sm text-green-600">
                    {integration.status}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
              <NangoConnect
                integrationType={integration.type}
                sessionToken={sessionToken}
                userId={userId}
                onSuccess={handleIntegrationSuccess}
                onError={handleIntegrationError}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
