export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_sessions: {
        Row: {
          id: string
          userId: string
          sessionId: string
          lastActive: string
          expiresAt: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          userId: string
          sessionId: string
          lastActive: string
          expiresAt: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          userId?: string
          sessionId?: string
          lastActive?: string
          expiresAt?: string
          metadata?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      nango_connections: {
        Row: {
          id: string
          connectionId: string
          sessionId: string
          providerConfigKey: string
          userId: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          connectionId: string
          sessionId: string
          providerConfigKey: string
          userId: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          connectionId?: string
          sessionId?: string
          providerConfigKey?: string
          userId?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nango_connections_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      // Add your views here
    }
    Functions: {
      // Add your functions here
    }
    Enums: {
      // Add your enums here
    }
  }
}
