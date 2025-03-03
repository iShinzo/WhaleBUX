import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useUserStore } from './userStore'
import { 
  MINING_RATE_UPGRADES, 
  MINING_BOOST_UPGRADES,
  MINING_TIME_UPGRADES,
  NFT_SLOT_UPGRADES
} from '../config/miningConfig'

interface BoostState {
  miningRateLevel: number
  miningBoostLevel: number
  miningTimeLevel: number
  nftSlotLevel: number
  upgradeMiningRate: () => void
  upgradeMiningBoost: () => void
  upgradeMiningTime: () => void
  upgradeNFTSlots: () => void
}

export const useBoostStore = create<BoostState>()(
  persist(
    (set, get) => ({
      miningRateLevel: 0,
      miningBoostLevel: 0,
      miningTimeLevel: 0,
      nftSlotLevel: 0,

      upgradeMiningRate: () => {
        const currentLevel = get().miningRateLevel
        if (currentLevel >= MINING_RATE_UPGRADES.length) return

        const upgrade = MINING_RATE_UPGRADES[currentLevel]
        const userStore = useUserStore.getState()

        if (upgrade.cost > 0 && userStore.wbuxDollars >= upgrade.cost) {
          userStore.addWbuxDollars(-upgrade.cost)
          set({ miningRateLevel: currentLevel + 1 })
        } else if (upgrade.tokenCost > 0 && userStore.wbuxBalance >= upgrade.tokenCost) {
          userStore.addWbuxBalance(-upgrade.tokenCost)
          set({ miningRateLevel: currentLevel + 1 })
        }
      },

      upgradeMiningBoost: () => {
        const currentLevel = get().miningBoostLevel
        if (currentLevel >= MINING_BOOST_UPGRADES.length) return

        const upgrade = MINING_BOOST_UPGRADES[currentLevel]
        const userStore = useUserStore.getState()

        if (upgrade.cost > 0 && userStore.wbuxDollars >= upgrade.cost) {
          userStore.addWbuxDollars(-upgrade.cost)
          set({ miningBoostLevel: currentLevel + 1 })
        } else if (upgrade.tokenCost > 0 && userStore.wbuxBalance >= upgrade.tokenCost) {
          userStore.addWbuxBalance(-upgrade.tokenCost)
          set({ miningBoostLevel: currentLevel + 1 })
        }
      },

      upgradeMiningTime: () => {
        const currentLevel = get().miningTimeLevel
        if (currentLevel >= MINING_TIME_UPGRADES.length) return

        const upgrade = MINING_TIME_UPGRADES[currentLevel]
        const userStore = useUserStore.getState()

        if (upgrade.cost > 0 && userStore.wbuxDollars >= upgrade.cost) {
          userStore.addWbuxDollars(-upgrade.cost)
          set({ miningTimeLevel: currentLevel + 1 })
        } else if (upgrade.tokenCost > 0 && userStore.wbuxBalance >= upgrade.tokenCost) {
          userStore.addWbuxBalance(-upgrade.tokenCost)
          set({ miningTimeLevel: currentLevel + 1 })
        }
      },

      upgradeNFTSlots: () => {
        const currentLevel = get().nftSlotLevel
        if (currentLevel >= NFT_SLOT_UPGRADES.length) return

        const upgrade = NFT_SLOT_UPGRADES[currentLevel]
        if (!upgrade.available) return

        const userStore = useUserStore.getState()

        if (upgrade.cost > 0 && userStore.wbuxDollars >= upgrade.cost) {
          userStore.addWbuxDollars(-upgrade.cost)
          set({ nftSlotLevel: currentLevel + 1 })
        } else if (upgrade.tokenCost > 0 && userStore.wbuxBalance >= upgrade.tokenCost) {
          userStore.addWbuxBalance(-upgrade.tokenCost)
          set({ nftSlotLevel: currentLevel + 1 })
        }
      }
    }),
    {
      name: 'boost-storage'
    }
  )
)