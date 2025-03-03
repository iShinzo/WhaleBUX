import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TreasuryState {
  totalDollars: number
  transactions: TreasuryTransaction[]
  addTransaction: (transaction: Omit<TreasuryTransaction, 'id' | 'timestamp'>) => void
  getTotalDollars: () => number
  withdrawDollars: (amount: number, recipientId: string) => boolean
  isAdmin: (userId: string) => boolean
}

export interface TreasuryTransaction {
  id: string
  type: 'UPGRADE' | 'SWAP' | 'WITHDRAWAL' | 'AIRDROP'
  amount: number
  userId: string
  description: string
  timestamp: number
}

export const useTreasuryStore = create<TreasuryState>()(
  persist(
    (set, get) => ({
      totalDollars: 0,
      transactions: [],
      
      addTransaction: (transaction) => {
        const newTransaction: TreasuryTransaction = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          ...transaction
        }
        
        set(state => ({
          totalDollars: state.totalDollars + transaction.amount,
          transactions: [newTransaction, ...state.transactions]
        }))
      },

      getTotalDollars: () => get().totalDollars,

      withdrawDollars: (amount, recipientId) => {
        if (!get().isAdmin(recipientId) || amount > get().totalDollars) {
          return false
        }

        set(state => ({
          totalDollars: state.totalDollars - amount,
          transactions: [{
            id: Math.random().toString(36).substr(2, 9),
            type: 'WITHDRAWAL',
            amount: -amount,
            userId: recipientId,
            description: 'Treasury withdrawal',
            timestamp: Date.now()
          }, ...state.transactions]
        }))

        return true
      },

      isAdmin: (userId) => userId === '@iShinzo' // Replace with your admin username
    }),
    {
      name: 'treasury-storage'
    }
  )
)