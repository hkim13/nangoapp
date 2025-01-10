import { createClient } from '@supabase/supabase-js'
import { UserSession, NangoConnection } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Session management functions
export const sessionManager = {
  async createSession(userId: string): Promise<UserSession | null> {
    try {
      // First verify the JWT is valid
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      if (authError || !session) {
        console.error('Invalid JWT session:', authError)
        return null
      }

      const sessionId = crypto.randomUUID()
      const now = new Date()
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours from now

      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          userId,
          sessionId,
          lastActive: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
          metadata: {
            authSessionId: session.access_token,
          },
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating session:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Session creation failed:', error)
      return null
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
      if (data.metadata?.authSessionId !== session.access_token) {
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
      const now = new Date()
      const { error } = await supabase
        .from('user_sessions')
        .update({
          lastActive: now.toISOString(),
          updatedAt: now.toISOString(),
        })
        .eq('sessionId', sessionId)

      if (error) {
        console.error('Error updating session activity:', error)
      }
    } catch (error) {
      console.error('Update session activity failed:', error)
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
