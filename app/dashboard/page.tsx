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

      // First, try to find user in internal_users
      const { data: internalUser, error: internalError } = await supabase
        .from('internal_users')
        .select('role')
        .eq('auth_id', user.id)
        .single()

      if (internalUser) {
        // Handle internal user routing
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
            console.error('Invalid internal user role')
            await supabase.auth.signOut()
            router.push('/auth/login')
        }
        return
      }

      // If not internal user, check external_users
      const { data: externalUser, error: externalError } = await supabase
        .from('external_users')
        .select('role')
        .eq('auth_id', user.id)
        .single()

      if (externalError || !externalUser) {
        console.error('Error fetching user role:', externalError)
        await supabase.auth.signOut()
        router.push('/auth/login')
        return
      }

      // Handle external user routing
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
          console.error('Invalid external user role')
          await supabase.auth.signOut()
          router.push('/auth/login')
      }
    }

    checkUserAndRedirect()
  }, [router])

  return null // This component only handles routing
}
