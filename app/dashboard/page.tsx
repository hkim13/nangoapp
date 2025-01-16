'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.log('No user found, redirecting to login')
        router.push('/auth/login')
        return
      }

      // Get user role from external_users table
      const { data: externalUser, error } = await supabase
        .from('external_users')
        .select('role')
        .eq('auth_id', user.id)
        .single()

      if (error || !externalUser) {
        console.error('Error fetching user role:', error)
        await supabase.auth.signOut()
        router.push('/auth/login')
        return
      }

      // Redirect based on role
      switch (externalUser.role) {
        case 'free':
          router.push('/dashboard/free')
          break
        case 'premium':
          router.push('/dashboard/premium')
          break
        case 'client':
          router.push('/dashboard/client')
          break
        default:
          console.error('Invalid user role')
          await supabase.auth.signOut()
          router.push('/auth/login')
      }
    }

    checkUserAndRedirect()
  }, [router])

  return null // This component only handles routing
}
