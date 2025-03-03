import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LEVEL_CONFIG } from '../config/miningConfig'
import { WhaleBuxDB } from '../db/database'
import { WebApp } from '@twa-dev/sdk'

const db = new WhaleBuxDB()

interface Friend {
  id: string
  username: string
  level: number
  joinedAt: string
  lastActive: string
  miningStreak: number
  totalMined: number
  taskPoints: number
}

interface UserState {
  username: string
  wbuxBalance: number
  wbuxDollars: number
  level: number
  experience: number
  adminUsername: string
  loginStreak: number
  lastLoginDate: string | null
  friends: Friend[]
  referralBoost: number
  
  setUsername: (username: string) => void
  addWbuxDollars: (amount: number) => Promise<void>
  addWbuxBalance: (amount: number) => Promise<void>
  addExperience: (amount: number) => Promise<void>
  checkLevelUp: () => Promise<void>
  loadUserData: () => Promise<void>
  updateLoginStreak: () => Promise<void>
  addFriend: (friend: Friend) => void
  removeFriend: (friendId: string) => void
  upgradeFriendLevel: (friendId: string) => void
  calculateReferralBoost: () => void
}

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const isConsecutiveDay = (date1: Date, date2: Date) => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  // Check if it's the next calendar day, allowing for some time zone flexibility
  return diffDays === 1 || (diffDays === 0 && !isSameDay(date1, date2))
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      username: 'user123',
      wbuxBalance: 0,
      wbuxDollars: 0,
      level: 1,
      experience: 0,
      adminUsername: '@iShinzo',
      loginStreak: 0,
      lastLoginDate: null,
      friends: [],
      referralBoost: 0,

      setUsername: async (username) => {
        set({ username })
        await db.createOrUpdateUser({ username })
      },
      
      addWbuxDollars: async (amount) => {
        const newDollars = get().wbuxDollars + amount
        set({ wbuxDollars: newDollars })
        await db.createOrUpdateUser({ wbuxDollars: newDollars })
        if (amount > 0) {
          await get().addExperience(amount)
        }
      },

      addWbuxBalance: async (amount) => {
        const newBalance = get().wbuxBalance + amount
        set({ wbuxBalance: newBalance })
        await db.createOrUpdateUser({ wbuxBalance: newBalance })
      },

      addExperience: async (amount) => {
        const newExperience = get().experience + amount
        set({ experience: newExperience })
        await db.createOrUpdateUser({ experience: newExperience })
        await get().checkLevelUp()
      },

      checkLevelUp: async () => {
        const state = get()
        const currentConfig = LEVEL_CONFIG[state.level]
        const nextLevel = state.level + 1
        
        if (state.experience >= currentConfig.xpMax && state.level < 9) {
          set({ level: nextLevel })
          await db.createOrUpdateUser({ level: nextLevel })
        }
      },

      updateLoginStreak: async () => {
        const today = new Date()
        const todayStr = today.toISOString().split('T')[0]
        const { lastLoginDate, loginStreak } = get()

        if (!lastLoginDate) {
          // First login
          set({ loginStreak: 1, lastLoginDate: todayStr })
          await db.createOrUpdateUser({ loginStreak: 1, lastLoginDate: todayStr })
          return
        }

        const lastLogin = new Date(lastLoginDate)
        
        // If it's the same day, don't update anything
        if (isSameDay(today, lastLogin)) {
          return
        }

        // If it's the next consecutive day
        if (isConsecutiveDay(lastLogin, today)) {
          const newStreak = loginStreak + 1
          set({ loginStreak: newStreak, lastLoginDate: todayStr })
          await db.createOrUpdateUser({ loginStreak: newStreak, lastLoginDate: todayStr })
        } else {
          // If more than one day has passed, reset streak
          set({ loginStreak: 1, lastLoginDate: todayStr })
          await db.createOrUpdateUser({ loginStreak: 1, lastLoginDate: todayStr })
        }
      },

      addFriend: (friend) => {
        set(state => ({
          friends: [...state.friends, friend]
        }))
        get().calculateReferralBoost()
      },

      removeFriend: (friendId) => {
        set(state => ({
          friends: state.friends.filter(f => f.id !== friendId)
        }))
        get().calculateReferralBoost()
      },

      upgradeFriendLevel: (friendId) => {
        set(state => ({
          friends: state.friends.map(friend =>
            friend.id === friendId && friend.level < 9
              ? { ...friend, level: friend.level + 1 }
              : friend
          )
        }))
        get().calculateReferralBoost()
      },

      calculateReferralBoost: () => {
        const { friends } = get()
        const activeCount = friends.filter(f => 
          (Date.now() - new Date(f.lastActive).getTime()) < 24 * 60 * 60 * 1000
        ).length
        
        const baseBoost = activeCount * 0.05 // 5% per active friend
        const levelBonus = friends.reduce((total, friend) => 
          total + (friend.level * 0.02), 0) // 2% per friend level
        
        set({ referralBoost: baseBoost + levelBonus })
      },

      loadUserData: async () => {
        const userData = await db.getCurrentUser()
        const telegramUser = WebApp?.initDataUnsafe?.user?.username

        if (userData) {
          set({
            username: telegramUser || userData.username,
            wbuxBalance: userData.wbuxBalance,
            wbuxDollars: userData.wbuxDollars,
            level: userData.level,
            experience: userData.experience,
            loginStreak: userData.loginStreak || 0,
            lastLoginDate: userData.lastLoginDate
          })
          // Update login streak when loading user data
          await get().updateLoginStreak()
        } else {
          await db.createOrUpdateUser({
            username: telegramUser || 'user123',
            wbuxBalance: 0,
            wbuxDollars: 0,
            level: 1,
            experience: 0,
            loginStreak: 0,
            lastLoginDate: null
          })
          // Initialize first login
          await get().updateLoginStreak()
        }
      }
    }),
    {
      name: 'user-storage'
    }
  )
)