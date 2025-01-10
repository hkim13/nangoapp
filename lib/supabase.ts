import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { UserSession, NangoConnection } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createClient()

// Session management functions
export const sessionManager = {
  async createSession(userId: string): Promise<UserSession> {
    try {
      // First, clean up any expired sessions for this user
      await this.cleanupExpiredSessions(userId)

      const now = new Date()
      const sessionId = crypto.randomUUID()
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours from now

      // Get current auth session for metadata
      const { data: { session: authSession } } = await supabase.auth.getSession()
      
      // Get user agent info
      const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown'
      
      const metadata = {
        authToken: authSession?.access_token,
        userAgent,
        platform: typeof window !== 'undefined' ? window.navigator.platform : 'unknown',
        lastLoginAt: now.toISOString(),
        loginCount: 1
      }

      const { data: session, error } = await supabase
        .from('user_sessions')
        .insert({
          userId,
          sessionId,
          lastActive: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
          metadata
        })
        .select()
        .single()

      if (error) throw error
      return session
    } catch (error) {
      console.error('Error creating session:', error)
      throw error
    }
  },

  async cleanupExpiredSessions(userId: string): Promise<void> {
    try {
      const now = new Date().toISOString()
      
      // Delete expired sessions
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('userId', userId)
        .or(`expiresAt.lt.${now},lastActive.lt.${now}`)

      if (error) throw error
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error)
      // Don't throw error here to prevent blocking session creation
    }
  },

  async getSession(sessionId: string): Promise<UserSession | null> {
    try {
      // First verify JWT is still valid
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      if (authError || !session) {
        console.error('Invalid JWT session:', authError)
        return null
      }

      const { data, error } = await supabase
        .from('user_sessions')
        .select()
        .eq('sessionId', sessionId)
        .single()

      if (error || !data) {
        console.error('Error getting session:', error)
        return null
      }

      // Check if session is expired
      if (new Date(data.expiresAt) < new Date()) {
        await this.deleteSession(sessionId)
        return null
      }

      // Verify the stored JWT matches current JWT
      if (data.metadata?.authToken !== session.access_token) {
        await this.deleteSession(sessionId)
        return null
      }

      return data
    } catch (error) {
      console.error('Get session failed:', error)
      return null
    }
  },

  async updateSessionActivity(sessionId: string): Promise<void> {
    try {
      const now = new Date().toISOString()
      
      // Get current session metadata
      const { data: currentSession } = await supabase
        .from('user_sessions')
        .select('metadata')
        .eq('sessionId', sessionId)
        .single()

      // Update metadata with visit count
      const updatedMetadata = {
        ...currentSession?.metadata,
        lastActiveAt: now,
        visitCount: ((currentSession?.metadata?.visitCount || 0) + 1)
      }

      const { error } = await supabase
        .from('user_sessions')
        .update({
          lastActive: now,
          metadata: updatedMetadata
        })
        .eq('sessionId', sessionId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating session activity:', error)
      throw error
    }
  },

  async deleteSession(sessionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('sessionId', sessionId)

      if (error) {
        console.error('Error deleting session:', error)
      }
    } catch (error) {
      console.error('Delete session failed:', error)
    }
  },

  async deleteAllUserSessions(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('userId', userId)

      if (error) {
        console.error('Error deleting user sessions:', error)
      }
    } catch (error) {
      console.error('Delete all user sessions failed:', error)
    }
  }
}
