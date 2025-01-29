'use client'

import { useState, useEffect } from 'react'
import { supabase, sessionManager } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        // Check if user is already authenticated
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          // Check if there's an active session
          const { data: session, error } = await supabase
            .from('user_sessions')
            .select()
            .eq('userId', user.id)
            .gt('expiresAt', new Date().toISOString())
            .order('createdAt', { ascending: false })
            .limit(1)
            .single()

          if (session && !error) {
            console.log('Active session found, redirecting to dashboard...')
            router.push('/dashboard')
            return
          }
        }
      } catch (error) {
        console.error('Error checking session:', error)
      }
    }

    checkExistingSession()
  }, [router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log('Starting login process...')
      
      // First, check if user already exists and has sessions
      const { data: { user: existingUser } } = await supabase.auth.getUser()
      
      if (existingUser) {
        // Delete all existing sessions for this user
        console.log('Cleaning up existing sessions...')
        await sessionManager.deleteAllUserSessions(existingUser.id)
      }

      // Proceed with authentication
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      console.log('Authentication successful:', data)

      // Create new session
      const session = await sessionManager.createSession(data.user.id)
      console.log('Session created successfully:', session)

      router.push('/dashboard')
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <Link href="/auth/reset-password" className="hover:text-primary">
              Forgot your password?
            </Link>
            <p>
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
