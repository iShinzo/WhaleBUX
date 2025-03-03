import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../../stores/userStore'

export default function DailyStreakButton() {
  const navigate = useNavigate()
  const { loginStreak } = useUserStore()

  return (
    <button 
      onClick={() => navigate('/daily-streak')}
      className="flex-1 bg-gray-800 p-3 rounded-lg text-center hover:bg-gray-700 transition-colors"
    >
      <div className="text-sm text-gray-400">Daily Streak</div>
      <div className="text-xl font-bold">{loginStreak}/30</div>
    </button>
  )
}