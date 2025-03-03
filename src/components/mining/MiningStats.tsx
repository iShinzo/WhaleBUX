import { useUserStore } from '../../stores/userStore'

export default function MiningStats() {
  const { miningPower, miningStreak, level, experience } = useUserStore()
  const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000]
  
  const nextLevelXP = LEVEL_THRESHOLDS[level]
  const progress = nextLevelXP ? (experience / nextLevelXP * 100).toFixed(1) : 100

  return (
    <div className="bg-white rounded-lg p-4 shadow-md mb-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Mining Power</p>
          <p className="text-xl font-bold text-blue-600">
            {miningPower.toFixed(0)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Mining Streak</p>
          <p className="text-xl font-bold text-green-600">
            {miningStreak} days
          </p>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Level {level}</span>
          <span>{experience} / {nextLevelXP} XP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 rounded-full h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}