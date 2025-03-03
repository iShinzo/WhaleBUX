import { LEVEL_CONFIG } from '../../config/miningConfig'
import { useBoostStore } from '../../stores/boostStore'

interface CircularTimerProps {
  progress: number
  isMining: boolean
  level: number
}

export default function CircularTimer({ progress, isMining, level }: CircularTimerProps) {
  const { miningTimeLevel } = useBoostStore()
  const radius = 120
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference
  const config = LEVEL_CONFIG[level]

  const formatTimeRemaining = () => {
    if (!isMining) {
      const timeReduction = miningTimeLevel * 30 // 30 minutes per level
      const adjustedDuration = Math.max(config.miningDuration * 60 - timeReduction, 30)
      return `${(adjustedDuration / 60).toFixed(1)}h Mining Time`
    }
    
    const timeReduction = miningTimeLevel * 30
    const adjustedDuration = Math.max(config.miningDuration * 60 - timeReduction, 30)
    const totalSeconds = (adjustedDuration * 60) * (1 - progress / 100)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    return `${hours}h ${minutes}m remaining`
  }

  return (
    <div className="relative">
      <svg width="300" height="300" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          stroke="#1a4a1f"
          strokeWidth="12"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          stroke="#22c55e"
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-100"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center mb-2">
          <span className="text-gray-400">Picture</span>
        </div>
        <div className="text-sm text-gray-400">
          {formatTimeRemaining()}
        </div>
      </div>
    </div>
  )
}