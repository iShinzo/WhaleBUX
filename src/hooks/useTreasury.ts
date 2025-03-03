import { useTreasuryStore } from '../stores/treasuryStore'

export const useTreasury = () => {
  const { addTransaction } = useTreasuryStore()

  const recordUpgrade = (userId: string, amount: number, upgradeName: string) => {
    addTransaction({
      type: 'UPGRADE',
      amount,
      userId,
      description: `Purchased ${upgradeName} upgrade`
    })
  }

  const recordSwap = (userId: string, amount: number) => {
    addTransaction({
      type: 'SWAP',
      amount,
      userId,
      description: 'Swapped WBUX $Dollars for $WBUX'
    })
  }

  const recordAirdrop = (userId: string, amount: number, recipients: number) => {
    addTransaction({
      type: 'AIRDROP',
      amount,
      userId,
      description: `Airdropped to ${recipients} recipients`
    })
  }

  return {
    recordUpgrade,
    recordSwap,
    recordAirdrop
  }
}