import { useUserStore } from '../../stores/userStore'
import { LEVEL_CONFIG } from '../../config/miningConfig'

export default function ExperienceBar() {
  const { level, experience } = useUserStore()
  const config = LEVEL_CONFIG[level]
  
  const progress = ((experience - config.xpMin) / (config.xpMax - config.xpMin)) * 100

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">Level {level}</span>
        <span className="text-sm text-gray-400">
          {experience.toFixed(2)} / {config.xpMax.toFixed(2)}
        </span>
      </div>
      
      <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-green-300 to-green-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}