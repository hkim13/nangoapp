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
    <nav className="border-b border-gray-800 bg-black relative z-50">
      <div className="flex h-16 items-center px-4 container mx-auto">
     
        
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image 
              src="/grayscale_transparent_logo.png" 
              alt="Logo" 
              width={40} 
              height={40} 
              className="object-contain"
              style={{ 
                fontFamily: 'var(--font-geist-sans)',
                fontWeight: 500
              }}
            />
          </Link>
          <Link href="/">
            <span className="font-semibold text-xl text-white">Seamless AI</span>
          </Link>
        </div>

        {/* Right section with navigation links and auth buttons */}
        <div className="flex-1 flex items-center justify-end space-x-4">
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/dashboard"
                    className={`text-sm font-medium transition-colors hover:text-white ${
                      pathname === '/dashboard' ? 'text-white' : 'text-gray-300'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Button variant="outline" onClick={handleSignOut} className="text-black border-white hover:bg-black hover:text-white">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link href="/auth/login">
                  <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">Sign In</Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
