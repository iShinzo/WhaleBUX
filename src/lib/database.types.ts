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
      users: {
        Row: {
          id: string
          telegram_id: string
          username: string | null
          wallet_address: string | null
          wbux_dollars: number
          level: number
          experience: number
          login_streak: number
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          telegram_id: string
          username?: string | null
          wallet_address?: string | null
          wbux_dollars?: number
          level?: number
          experience?: number
          login_streak?: number
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          telegram_id?: string
          username?: string | null
          wallet_address?: string | null
          wbux_dollars?: number
          level?: number
          experience?: number
          login_streak?: number
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'SWAP' | 'MINING' | 'TASK_REWARD' | 'REFERRAL'
          amount: number
          status: 'PENDING' | 'COMPLETED' | 'FAILED'
          tx_hash: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'SWAP' | 'MINING' | 'TASK_REWARD' | 'REFERRAL'
          amount: number
          status: 'PENDING' | 'COMPLETED' | 'FAILED'
          tx_hash?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'SWAP' | 'MINING' | 'TASK_REWARD' | 'REFERRAL'
          amount?: number
          status?: 'PENDING' | 'COMPLETED' | 'FAILED'
          tx_hash?: string | null
          created_at?: string
        }
      }
    }
  }
}