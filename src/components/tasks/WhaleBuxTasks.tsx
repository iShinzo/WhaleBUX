import { useState } from 'react'
import { useUserStore } from '../../stores/userStore'
import { useTaskStore } from '../../stores/taskStore'

type BoostType = 'MINING_BOOST' | 'MINING_RATE'

interface AdminTaskFormData {
  category: 'GAME' | 'APP' | 'CHANNEL' | 'OTHER'
  referralLink: string
  paymentCurrency: 'WBUX_DOLLARS' | 'WBUX' | 'BUSDT'
  description: string
  duration: '1_DAY' | '1_WEEK' | '1_MONTH' | 'CUSTOM'
  customDuration?: string
  workType: 'JOIN' | 'PLAY' | 'COMPLETE_REGISTRATION'
  paymentType: 'DAILY' | 'WEEKLY'
  paymentAmount: number
  boostType: BoostType
  boostAmount: number
}

export default function WhaleBuxTasks() {
  const { username, adminUsername } = useUserStore()
  const { addTask } = useTaskStore()
  const isAdmin = username === adminUsername
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState<AdminTaskFormData>({
    category: 'GAME',
    referralLink: '',
    paymentCurrency: 'WBUX_DOLLARS',
    description: '',
    duration: '1_DAY',
    workType: 'JOIN',
    paymentType: 'DAILY',
    paymentAmount: 0,
    boostType: 'MINING_BOOST',
    boostAmount: 0
  })

  if (!isAdmin) {
    return (
      <div className="text-center py-8 text-gray-400">
        Only WhaleBux developers can create and manage tasks in this section.
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.referralLink || !formData.description || formData.paymentAmount <= 0) {
      alert('Please fill in all required fields')
      return
    }

    // Create WhaleBux task with boost
    addTask({
      ...formData,
      creatorId: 'WhaleBux',
      boostPoints: formData.boostAmount
    })

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setFormData({
        category: 'GAME',
        referralLink: '',
        paymentCurrency: 'WBUX_DOLLARS',
        description: '',
        duration: '1_DAY',
        workType: 'JOIN',
        paymentType: 'DAILY',
        paymentAmount: 0,
        boostType: 'MINING_BOOST',
        boostAmount: 0
      })
    }, 2000)
  }

  if (showSuccess) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <div className="text-green-500 text-xl font-bold mb-2">
          ✓ WhaleBux task has been created!
        </div>
        <p className="text-gray-400">
          The task is now visible in the Task Catalog with boost rewards
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-bold text-white">Create WhaleBux Task</h2>
        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Admin</span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Pick a category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as AdminTaskFormData['category'] })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
          >
            <option value="GAME">Game</option>
            <option value="APP">App</option>
            <option value="CHANNEL">Channel</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Place referral Link
          </label>
          <input
            type="text"
            value={formData.referralLink}
            onChange={(e) => setFormData({ ...formData, referralLink: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
            placeholder="Enter your referral link"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            I pay with
          </label>
          <select
            value={formData.paymentCurrency}
            onChange={(e) => setFormData({ ...formData, paymentCurrency: e.target.value as AdminTaskFormData['paymentCurrency'] })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
          >
            <option value="WBUX_DOLLARS">WBUX $Dollars</option>
            <option value="WBUX">$WBUX</option>
            <option value="BUSDT">$BUSDT</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
            rows={4}
            placeholder="Enter task details"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Duration of work
          </label>
          <select
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value as AdminTaskFormData['duration'] })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
          >
            <option value="1_DAY">1 Day</option>
            <option value="1_WEEK">1 Week</option>
            <option value="1_MONTH">1 Month</option>
            <option value="CUSTOM">Custom</option>
          </select>
          
          {formData.duration === 'CUSTOM' && (
            <input
              type="text"
              value={formData.customDuration}
              onChange={(e) => setFormData({ ...formData, customDuration: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white mt-2"
              placeholder="Enter custom duration"
              required
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Type of work
          </label>
          <select
            value={formData.workType}
            onChange={(e) => setFormData({ ...formData, workType: e.target.value as AdminTaskFormData['workType'] })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
          >
            <option value="JOIN">Join</option>
            <option value="PLAY">Play</option>
            <option value="COMPLETE_REGISTRATION">Complete Registration</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Payment Type
          </label>
          <select
            value={formData.paymentType}
            onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as AdminTaskFormData['paymentType'] })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Payment Amount
          </label>
          <input
            type="number"
            value={formData.paymentAmount}
            onChange={(e) => setFormData({ ...formData, paymentAmount: Number(e.target.value) })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
            min="0"
            step="0.01"
            placeholder="Enter payment amount"
            required
          />
        </div>

        <div className="space-y-4 border-t border-gray-700 pt-4">
          <h3 className="text-lg font-semibold text-white">Boost Rewards</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Boost Type
            </label>
            <select
              value={formData.boostType}
              onChange={(e) => setFormData({ ...formData, boostType: e.target.value as BoostType })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
            >
              <option value="MINING_BOOST">Mining Boost</option>
              <option value="MINING_RATE">Mining Rate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Boost Amount
            </label>
            <input
              type="number"
              value={formData.boostAmount}
              onChange={(e) => setFormData({ ...formData, boostAmount: Number(e.target.value) })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
              min="0"
              step="1"
              placeholder="Enter boost amount"
            />
            <p className="text-sm text-gray-400 mt-1">
              {formData.boostType === 'MINING_BOOST' ? '% increase to mining boost' : '% increase to mining rate'}
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500"
        >
          Create WhaleBux Task
        </button>
      </form>
    </div>
  )
}