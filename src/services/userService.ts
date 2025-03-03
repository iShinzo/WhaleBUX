import { supabase } from '../lib/supabase'
import { Database } from '../lib/database.types'

type User = Database['public']['Tables']['users']['Row']

export class UserService {
  static async createUser(telegramId: string, username?: string) {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        telegram_id: telegramId,
        username: username
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserByTelegramId(telegramId: string) {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('telegram_id', telegramId)
      .single()

    if (error) throw error
    return data
  }

  static async updateWalletAddress(userId: string, walletAddress: string) {
    const { data, error } = await supabase
      .from('users')
      .update({ wallet_address: walletAddress })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateLoginStreak(userId: string) {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('last_login, login_streak')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    const now = new Date()
    const lastLogin = user.last_login ? new Date(user.last_login) : null
    let newStreak = user.login_streak

    if (!lastLogin) {
      newStreak = 1
    } else {
      const daysSinceLastLogin = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceLastLogin === 1) {
        newStreak += 1
      } else if (daysSinceLastLogin > 1) {
        newStreak = 1
      }
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        last_login: now.toISOString(),
        login_streak: newStreak
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}