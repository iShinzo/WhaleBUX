import { useUserStore } from '../stores/userStore'
import { useBoostStore } from '../stores/boostStore'
import UserStats from '../components/mining/UserStats'
import BoostButton from '../components/boost/BoostButton'

export default function Boost() {
  const { wbuxBalance, wbuxDollars, username } = useUserStore()
  const { 
    miningRateLevel,
    miningBoostLevel,
    miningTimeLevel,
    nftSlotLevel,
    upgradeMiningRate,
    upgradeMiningBoost,
    upgradeMiningTime,
    upgradeNFTSlots
  } = useBoostStore()

  const miningRateConfig = {
    name: "Mining Rate",
    levels: [
      { level: 1, bonus: "+1 WBUX $/hr", cost: 10, tokenCost: 0 },
      { level: 2, bonus: "+1 WBUX $/hr", cost: 110, tokenCost: 0 },
      { level: 3, bonus: "+1 WBUX $/hr", cost: 500, tokenCost: 0 },
      { level: 4, bonus: "+1 WBUX $/hr", cost: 1200, tokenCost: 0 },
      { level: 5, bonus: "+1 WBUX $/hr", cost: 2800, tokenCost: 0 },
      { level: 6, bonus: "+2 WBUX $/hr", cost: 0, tokenCost: 5 },
      { level: 7, bonus: "+2 WBUX $/hr", cost: 0, tokenCost: 10 },
      { level: 8, bonus: "+2 WBUX $/hr", cost: 0, tokenCost: 20 },
      { level: 9, bonus: "+3 WBUX $/hr", cost: 0, tokenCost: 25 }
    ]
  }

  const miningBoostConfig = {
    name: "Mining Boost",
    levels: [
      { level: 1, bonus: "+5%", cost: 15, tokenCost: 0 },
      { level: 2, bonus: "+10%", cost: 130, tokenCost: 0 },
      { level: 3, bonus: "+16%", cost: 300, tokenCost: 0 },
      { level: 4, bonus: "+28%", cost: 1500, tokenCost: 0 },
      { level: 5, bonus: "+39%", cost: 2800, tokenCost: 0 },
      { level: 6, bonus: "+53%", cost: 0, tokenCost: 10 },
      { level: 7, bonus: "+69%", cost: 0, tokenCost: 30 },
      { level: 8, bonus: "+80%", cost: 0, tokenCost: 80 },
      { level: 9, bonus: "+120%", cost: 0, tokenCost: 120 }
    ]
  }

  const miningTimeConfig = {
    name: "Mining Time",
    levels: [
      { level: 1, bonus: "-30min", cost: 10, tokenCost: 0 },
      { level: 2, bonus: "-30min", cost: 150, tokenCost: 0 },
      { level: 3, bonus: "-30min", cost: 500, tokenCost: 0 },
      { level: 4, bonus: "-30min", cost: 1200, tokenCost: 0 },
      { level: 5, bonus: "-30min", cost: 2500, tokenCost: 0 },
      { level: 6, bonus: "-30min", cost: 0, tokenCost: 15 },
      { level: 7, bonus: "-30min", cost: 0, tokenCost: 30 },
      { level: 8, bonus: "-30min", cost: 0, tokenCost: 70 },
      { level: 9, bonus: "-30min", cost: 0, tokenCost: 125 }
    ]
  }

  const nftSlotConfig = {
    name: "NFT Card Slots",
    levels: [
      { level: 1, bonus: "+1 Slot", cost: 50, tokenCost: 0 },
      { level: 2, bonus: "+1 Slot", cost: 300, tokenCost: 0 },
      { level: 3, bonus: "+1 Slot", cost: 600, tokenCost: 0 },
      { level: 4, bonus: "+1 Slot", cost: 1500, tokenCost: 0 },
      { level: 5, bonus: "+1 Slot", cost: 3000, tokenCost: 0 },
      { level: 6, bonus: "+1 Slot", cost: 0, tokenCost: 10 },
      { level: 7, bonus: "+1 Slot", cost: 12000, tokenCost: 0 },
      { level: 8, bonus: "+1 Slot", cost: 0, tokenCost: 25 },
      { level: 9, bonus: "+1 Slot", cost: 0, tokenCost: 40 }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <UserStats 
        wbuxBalance={wbuxBalance}
        wbuxDollars={wbuxDollars}
        username={username}
      />

      <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-6">Mining Upgrades</h1>
        
        <div className="space-y-6">
          <BoostButton
            config={miningRateConfig}
            currentLevel={miningRateLevel}
            onUpgrade={upgradeMiningRate}
            wbuxDollars={wbuxDollars}
            wbuxBalance={wbuxBalance}
          />
          
          <BoostButton
            config={miningBoostConfig}
            currentLevel={miningBoostLevel}
            onUpgrade={upgradeMiningBoost}
            wbuxDollars={wbuxDollars}
            wbuxBalance={wbuxBalance}
          />

          <BoostButton
            config={miningTimeConfig}
            currentLevel={miningTimeLevel}
            onUpgrade={upgradeMiningTime}
            wbuxDollars={wbuxDollars}
            wbuxBalance={wbuxBalance}
          />

          <div className="relative">
            <BoostButton
              config={nftSlotConfig}
              currentLevel={nftSlotLevel}
              onUpgrade={upgradeNFTSlots}
              wbuxDollars={wbuxDollars}
              wbuxBalance={wbuxBalance}
              disabled={true}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <span className="text-white font-semibold">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}