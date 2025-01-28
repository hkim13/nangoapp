'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { supabase, sessionManager } from '@/lib/supabase'
import Image from 'next/image'

export function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setIsAuthenticated(!!user)
      } catch (error) {
        console.error('Error checking auth status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      console.log('Starting sign out process...')
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        console.log('Deleting user sessions...')
        await sessionManager.deleteAllUserSessions(user.id)
      }
      console.log('Signing out from Supabase...')
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="navbar-left flex items-center">
          <div>
            <Link href="/">
              <Image src="/color_logo_no_background.png" alt="Logo" width={35} height={35} />
            </Link>
          </div>
          <div className="ml-2 flex items-center" style={{ alignSelf: 'flex-end' }}>
            <Link href="/">
              <span className="font-semibold text-lg">Seamless AI</span>
            </Link>
          </div>
        </div>

        {/* Main navigation */}
        <div className="ml-auto flex items-center space-x-4">
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/dashboard"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === '/dashboard' ? 'text-black' : 'text-muted-foreground'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Button variant="outline" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link href="/auth/login">
                  <Button>Sign In</Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
