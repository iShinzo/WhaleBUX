import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../../stores/userStore'
import { useBoostStore } from '../../stores/boostStore'
import { 
  LEVEL_CONFIG, 
  calculateTotalMiningRate, 
  calculateTotalBoost 
} from '../../config/miningConfig'
import DailyStreakButton from '../home/DailyStreakButton'

interface MiningControlsProps {
  isMining: boolean
  currentMined: number
  onStartMining: () => void
}

export default function MiningControls({ isMining, currentMined, onStartMining }: MiningControlsProps) {
  const navigate = useNavigate()
  const { level, loginStreak } = useUserStore()
  const { miningRateLevel, miningBoostLevel } = useBoostStore()
  
  const config = LEVEL_CONFIG[level]
  const totalRate = calculateTotalMiningRate(config.baseRate, miningRateLevel)
  const totalBoost = calculateTotalBoost(config.boost, miningBoostLevel, loginStreak)

  const formatMiningInfo = () => {
    if (!isMining) {
      return (
        <div className="text-center">
          <div className="text-xl font-bold">Start Mining</div>
          <div className="text-sm text-gray-400 mt-1">
            Rate: ${totalRate.toFixed(2)}/hr (+{miningRateLevel} levels)
          </div>
          <div className="text-sm text-gray-400">
            Boost: +{totalBoost.toFixed(0)}% total
          </div>
        </div>
      )
    }

    return (
      <div className="text-center">
        <div className="text-xl font-bold">
          Mining in progress: ${currentMined.toFixed(2)}
        </div>
        <div className="text-sm text-gray-400 mt-1">
          Rate: ${totalRate.toFixed(2)}/hr • Boost: +{totalBoost.toFixed(0)}%
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 w-full max-w-md">
      <button
        onClick={onStartMining}
        disabled={isMining}
        className={`w-full py-4 rounded-lg mb-6 ${
          isMining 
            ? 'bg-green-800 text-green-200 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-500'
        }`}
      >
        {formatMiningInfo()}
      </button>

      <div className="flex justify-between gap-4">
        <DailyStreakButton />

        <button 
          onClick={() => navigate('/boost')}
          className="flex-1 bg-blue-600 p-3 rounded-lg text-center hover:bg-blue-500"
        >
          <div className="text-sm">Boost</div>
          <div className="text-xl font-bold">Upgrade</div>
        </button>

        <button 
          className="flex-1 bg-gray-800 p-3 rounded-lg text-center cursor-not-allowed"
          disabled
        >
          <div className="text-sm text-gray-400">NFT Auction</div>
          <div className="text-xs mt-1">Coming Soon</div>
        </button>
      </div>
    </div>
  )
}