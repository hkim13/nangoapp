'use client'

import { useEffect, useState } from 'react'
import { supabase, sessionManager } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
      await refreshSessions()
    }

    getUser()
  }, [router])

  const refreshSessions = async () => {
    const response = await fetch('/api/test-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'list' }),
    })
    const data = await response.json()
    if (data.sessions) {
      setSessions(data.sessions)
    }
  }

  const expireCurrentSession = async () => {
    await fetch('/api/test-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'expire' }),
    })
    await refreshSessions()
  }

  const handleSignOut = async () => {
    console.log('Starting sign out process...')
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      console.log('Deleting user sessions...')
      await sessionManager.deleteAllUserSessions(user.id)
    }
    console.log('Signing out from Supabase...')
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-6 min-h-[calc(100vh-4rem)]">
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
              <h2 className="text-xl font-bold mb-2">Sessions</h2>
              <div className="space-y-2">
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

            <div className="space-x-4">
              <Button onClick={expireCurrentSession} variant="destructive">
                Expire Current Session
              </Button>
              <Button onClick={refreshSessions}>
                Refresh Sessions
              </Button>
              <Button onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
