import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { action } = await request.json()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    switch (action) {
      case 'expire':
        // Set session to expire immediately
        const { error: updateError } = await supabase
          .from('user_sessions')
          .update({
            expiresAt: new Date().toISOString(),
          })
          .eq('userId', user.id)

        if (updateError) {
          throw updateError
        }

        return NextResponse.json({ message: 'Session expired' })

      case 'list':
        // Get all sessions for the user
        const { data: sessions, error: listError } = await supabase
          .from('user_sessions')
          .select('*')
          .eq('userId', user.id)
          .order('createdAt', { ascending: false })

        if (listError) {
          throw listError
        }

        return NextResponse.json({ sessions })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Session test error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
