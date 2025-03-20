'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { supabase, sessionManager } from '@/lib/supabase'
import Image from 'next/image'

export function Navbar() {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }>({
    isAuthenticated: false,
    isLoading: true,
    error: null
  })
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          throw error
        }
        
        setAuthState({
          isAuthenticated: !!user,
          isLoading: false,
          error: null
        })
      } catch (error) {
        console.error('Error checking auth status:', error)
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Authentication check failed'
        })
      }
    }

    checkAuth()

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: !!session,
        isLoading: false
      }))
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        throw userError
      }
      
      if (user) {
        await sessionManager.deleteAllUserSessions(user.id)
      }
      
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        throw signOutError
      }
      
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: null
      })
      
      router.push('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign out failed'
      }))
    }
  }

  const { isAuthenticated, isLoading, error } = authState

  return (
    <nav className="border-b border-gray-800 bg-black relative z-50">
      <div className="flex h-16 items-center justify-between px-4 container mx-auto">
        {/* Logo and brand name */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/grayscale_transparent_logo.png" 
              alt="Seamless AI Logo" 
              width={40} 
              height={40} 
              className="object-contain"
              priority
            />
            <span className="font-semibold text-xl text-white">Seamless AI</span>
          </Link>
        </div>

        {/* Navigation links and auth buttons */}
        <div className="flex items-center space-x-4">
      
          {isLoading ? (
            <div className="h-10 w-16 bg-gray-700 animate-pulse rounded-md"></div>
          ) : (
            <>
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/dashboard"
                    className={`text-sm font-medium transition-colors hover:text-gray-300 ${
                      pathname.startsWith('/dashboard') ? 'text-white' : 'text-gray-300'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={handleSignOut}
                    disabled={isLoading}
                    className="text-black border-white border hover:text-white hover:bg-white/10"
                  >
                    {isLoading ? 'Signing out...' : 'Sign Out'}
                  </Button>
                </>
              ) : (
                <Link href="/auth/login">
                  <Button 
                    variant="outline" 
                    className="text-black border-white border hover:text-white hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
