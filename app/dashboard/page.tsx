'use client'

import { useEffect, useState } from 'react'
import { supabase, sessionManager } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IntegrationManager } from '@/components/integration-manager'

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

        <IntegrationManager
          clientId="premium" // This could be fetched from user's data or environment
          userId={user.id}
          sessionToken={user.id}
        />
      </div>
    </div>
  )
}
