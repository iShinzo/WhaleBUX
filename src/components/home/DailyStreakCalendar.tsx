import { useUserStore } from '../../stores/userStore'

interface DailyStreakCalendarProps {
  onClose: () => void
}

interface DayProps {
  day: number
  isActive: boolean
  isToday: boolean
}

function Day({ day, isActive, isToday }: DayProps) {
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
        isActive
          ? 'bg-green-600 text-white'
          : 'bg-gray-700 text-gray-400'
      } ${
        isToday ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-800' : ''
      }`}
    >
      {day}
    </div>
  )
}

export default function DailyStreakCalendar({ onClose }: DailyStreakCalendarProps) {
  const { loginStreak } = useUserStore()
  const days = Array.from({ length: 28 }, (_, i) => i + 1)
  const today = new Date().getDate()

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Daily Login Streak</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {days.map(day => (
          <Day
            key={day}
            day={day}
            isActive={day <= loginStreak}
            isToday={day === today}
          />
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">7 days</span>
          <span className="text-green-500">+5% Mining Boost</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">14 days</span>
          <span className="text-green-500">+10% Mining Boost</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">21 days</span>
          <span className="text-green-500">+15% Mining Boost</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">28 days</span>
          <span className="text-green-500">+25% Mining Boost</span>
        </div>
      </div>
    </div>
  )
}