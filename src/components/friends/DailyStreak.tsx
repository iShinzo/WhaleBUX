import { useUserStore } from '../../stores/userStore'
import { calculateLoginStreakBoost } from '../../config/miningConfig'

export default function DailyStreak() {
  const { loginStreak } = useUserStore()
  const currentBoost = calculateLoginStreakBoost(loginStreak)

  const getBoostStatus = (days: number) => {
    if (loginStreak >= days) {
      return true
    }
    return false
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Daily Login Streak</h3>
        <span className="text-green-500 font-medium">
          {loginStreak} days
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm items-center">
          <span className="text-gray-400">7 days</span>
          <div className="flex items-center gap-2">
            <span className="text-green-500">+5% Mining Boost</span>
            {getBoostStatus(7) && (
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">Active</span>
            )}
          </div>
        </div>
        <div className="flex justify-between text-sm items-center">
          <span className="text-gray-400">14 days</span>
          <div className="flex items-center gap-2">
            <span className="text-green-500">+10% Mining Boost</span>
            {getBoostStatus(14) && (
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">Active</span>
            )}
          </div>
        </div>
        <div className="flex justify-between text-sm items-center">
          <span className="text-gray-400">21 days</span>
          <div className="flex items-center gap-2">
            <span className="text-green-500">+15% Mining Boost</span>
            {getBoostStatus(21) && (
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">Active</span>
            )}
          </div>
        </div>
        <div className="flex justify-between text-sm items-center">
          <span className="text-gray-400">28 days</span>
          <div className="flex items-center gap-2">
            <span className="text-green-500">+25% Mining Boost</span>
            {getBoostStatus(28) && (
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">Active</span>
            )}
          </div>
        </div>
      </div>

      {currentBoost > 0 && (
        <div className="mt-4 bg-green-900/20 p-3 rounded-lg">
          <p className="text-green-500 text-sm font-medium">
            Current Active Boost: +{currentBoost}%
          </p>
        </div>
      )}
    </div>
  )
}