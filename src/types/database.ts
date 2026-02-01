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
      profiles: {
        Row: {
          id: string
          email: string | null
          username: string | null
          avatar_url: string | null
          discord_id: string | null
          subscription_status: 'active' | 'canceled' | 'pending' | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan_id: string | null
          role_granted: boolean
          is_grandfathered: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          username?: string | null
          avatar_url?: string | null
          discord_id?: string | null
          subscription_status?: 'active' | 'canceled' | 'pending' | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan_id?: string | null
          role_granted?: boolean
          is_grandfathered?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          username?: string | null
          avatar_url?: string | null
          discord_id?: string | null
          subscription_status?: 'active' | 'canceled' | 'pending' | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan_id?: string | null
          role_granted?: boolean
          is_grandfathered?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          discord_user_id: string
          discord_username: string
          discord_avatar_url: string | null
          content: string
          image_urls: string[]
          message_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          discord_user_id: string
          discord_username: string
          discord_avatar_url?: string | null
          content: string
          image_urls?: string[]
          message_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          discord_user_id?: string
          discord_username?: string
          discord_avatar_url?: string | null
          content?: string
          image_urls?: string[]
          message_id?: string | null
          created_at?: string
        }
      }
      winning_slips: {
        Row: {
          id: string
          discord_user_id: string
          discord_username: string
          discord_avatar_url: string | null
          content: string | null
          image_urls: string[]
          message_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          discord_user_id: string
          discord_username: string
          discord_avatar_url?: string | null
          content?: string | null
          image_urls?: string[]
          message_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          discord_user_id?: string
          discord_username?: string
          discord_avatar_url?: string | null
          content?: string | null
          image_urls?: string[]
          message_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type WinningSlip = Database['public']['Tables']['winning_slips']['Row']
