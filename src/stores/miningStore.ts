import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  LEVEL_CONFIG, 
  calculateMiningEarnings,
  calculateTimeReduction
} from '../config/miningConfig'
import { useUserStore } from './userStore'
import { useBoostStore } from './boostStore'

interface MiningState {
  isMining: boolean
  miningStartTime: number | null
  currentMined: number
  miningProgress: number
  startMining: () => void
  stopMining: () => void
  updateMiningProgress: (level: number) => void
  claimRewards: () => void
}

export const useMiningStore = create<MiningState>()(
  persist(
    (set, get) => ({
      isMining: false,
      miningStartTime: null,
      currentMined: 0,
      miningProgress: 0,

      startMining: () => {
        const startTime = Date.now()
        set({
          isMining: true,
          miningStartTime: startTime,
          currentMined: 0,
          miningProgress: 0
        })
      },

      stopMining: () => {
        set({
          isMining: false,
          miningStartTime: null,
          currentMined: 0,
          miningProgress: 0
        })
      },

      updateMiningProgress: (level: number) => {
        const state = get()
        if (!state.isMining || !state.miningStartTime) return

        const config = LEVEL_CONFIG[level]
        const { miningRateLevel, miningBoostLevel, miningTimeLevel } = useBoostStore.getState()
        const { loginStreak } = useUserStore.getState()

        // Calculate reduced mining duration based on upgrades
        const timeReduction = calculateTimeReduction(miningTimeLevel)
        const adjustedDuration = Math.max(config.miningDuration * 60 - timeReduction, 30) // Convert hours to minutes, minimum 30 min
        const miningDurationMs = adjustedDuration * 60 * 1000 // Convert minutes to milliseconds

        const elapsed = Date.now() - state.miningStartTime
        const progress = Math.min((elapsed / miningDurationMs) * 100, 100)
        
        const earnedAmount = calculateMiningEarnings(
          config.baseRate,
          adjustedDuration / 60, // Convert minutes back to hours
          miningRateLevel,
          miningBoostLevel,
          config.boost,
          loginStreak
        ) * (progress / 100)
        
        set({
          miningProgress: progress,
          currentMined: earnedAmount
        })

        if (progress >= 100) {
          get().claimRewards()
        }
      },

      claimRewards: () => {
        const state = get()
        if (state.currentMined > 0) {
          useUserStore.getState().addWbuxDollars(state.currentMined)
          get().stopMining()
        }
      }
    }),
    {
      name: 'mining-storage'
    }
  )
)