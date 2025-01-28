'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function InternalLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // First sign out any existing session
      await supabase.auth.signOut()

      // Attempt to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      // Get the session to verify the user is authenticated
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Authentication failed')
      }

      // Check if user exists in internal_users table
      const { data: internalUser, error: dbError } = await supabase
        .from('internal_users')
        .select('role')
        .eq('auth_id', session.user.id)
        .single()

      if (dbError) {
        console.error('Database error:', dbError)
        throw new Error('Error verifying internal user access')
      }

      if (!internalUser) {
        await supabase.auth.signOut()
        throw new Error('Unauthorized. This portal is for internal users only.')
      }

      // Redirect based on role
      switch (internalUser.role) {
        case 'super_admin':
          router.push('/dashboard/internal/super-admin')
          break
        case 'admin':
          router.push('/dashboard/internal/admin')
          break
        case 'developer':
          router.push('/dashboard/internal/developer')
          break
        default:
          throw new Error('Invalid role')
      }
    } catch (error) {
      console.error('Login error:', error)
      await supabase.auth.signOut()
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred')
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold">Internal Portal Login</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access restricted to internal team members only
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded">{error}</div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
