'use client'

import { useEffect, useState } from 'react'
import { supabase, sessionManager } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NangoConnect } from '@/components/nango-connect'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      console.log('Checking user session...')
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.log('No user found, redirecting to login')
        router.push('/auth/login')
        return
      }

      console.log('User found:', user)
      
      // Get active session
      const sessions = await supabase
        .from('user_sessions')
        .select()
        .eq('userId', user.id)
        .order('createdAt', { ascending: false })
        .limit(1)
        .single()

      if (!sessions.data) {
        console.error('No active session found')
        await supabase.auth.signOut()
        router.push('/auth/login')
        return
      }

      console.log('Active session found:', sessions.data)

      // Update session activity
      await sessionManager.updateSessionActivity(sessions.data.sessionId)
      console.log('Session activity updated')
      
      setUser(user)
      setSessions([sessions.data])
    }

    getUser()
  }, [router])

  const handleIntegrationSuccess = () => {
    console.log('Airtable integration connected successfully')
    // You can add a toast notification or update UI state here
  }

  const handleIntegrationError = (error: Error) => {
    console.error('Airtable integration failed:', error)
    // You can add a toast notification or error message here
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-6 min-h-[calc(100vh-4rem)]">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">User Info</h2>
                <p>Email: {user.email}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-2">Current Session</h2>
                {sessions.map((session) => (
                  <div key={session.id} className="p-4 border rounded">
                    <p>Session ID: {session.sessionId}</p>
                    <p>Created: {new Date(session.createdAt).toLocaleString()}</p>
                    <p>Expires: {new Date(session.expiresAt).toLocaleString()}</p>
                    <p>Last Active: {new Date(session.lastActive).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">Airtable Connection</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Connect your Airtable account to sync your data
                </p>
                <NangoConnect
                  sessionToken={user.id}
                  userId={user.id}
                  onSuccess={handleIntegrationSuccess}
                  onError={handleIntegrationError}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
