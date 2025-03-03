import { useEffect, useState } from 'react'
import { WebApp } from '@twa-dev/sdk'
import { UserService } from '../services/userService'
import { useUserStore } from '../stores/userStore'

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setUsername } = useUserStore()

  useEffect(() => {
    const initializeUser = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get Telegram user data
        const telegramUser = WebApp.initDataUnsafe?.user
        if (!telegramUser?.id) {
          throw new Error('No Telegram user data available')
        }

        // Try to get existing user or create new one
        let user = await UserService.getUserByTelegramId(telegramUser.id.toString())
        if (!user) {
          user = await UserService.createUser(
            telegramUser.id.toString(),
            telegramUser.username
          )
        }

        // Update login streak
        await UserService.updateLoginStreak(user.id)

        // Update local state
        setUsername(user.username || 'Anonymous')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize user')
      } finally {
        setIsLoading(false)
      }
    }

    initializeUser()
  }, [])

  return { isLoading, error }
}