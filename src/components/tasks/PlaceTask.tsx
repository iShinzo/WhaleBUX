import { useState } from 'react'
import { useUserStore } from '../../stores/userStore'
import { useTaskStore } from '../../stores/taskStore'

type Category = 'GAME' | 'APP' | 'CHANNEL' | 'OTHER'
type PaymentCurrency = 'WBUX_DOLLARS' | 'WBUX' | 'BUSDT'
type WorkDuration = '1_DAY' | '1_WEEK' | '1_MONTH' | 'CUSTOM'
type WorkType = 'JOIN' | 'PLAY' | 'COMPLETE_REGISTRATION'
type PaymentTime = 'DAILY' | 'WEEKLY' | 'ONE_TIME'

interface TaskFormData {
  category: Category
  referralLink: string
  paymentCurrency: PaymentCurrency
  description: string
  duration: WorkDuration
  customDuration?: string
  workType: WorkType
  paymentTime: PaymentTime
  paymentAmount: number
}

export default function PlaceTask() {
  const { username } = useUserStore()
  const { addTask } = useTaskStore()
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState<TaskFormData>({
    category: 'GAME',
    referralLink: '',
    paymentCurrency: 'WBUX_DOLLARS',
    description: '',
    duration: '1_DAY',
    workType: 'JOIN',
    paymentTime: 'DAILY',
    paymentAmount: 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.referralLink || !formData.description || formData.paymentAmount <= 0) {
      alert('Please fill in all required fields')
      return
    }

    // Create task
    addTask({
      ...formData,
      creatorId: username
    })

    // Show success message
    setShowSuccess(true)

    // Reset form after 2 seconds
    setTimeout(() => {
      setShowSuccess(false)
      setFormData({
        category: 'GAME',
        referralLink: '',
        paymentCurrency: 'WBUX_DOLLARS',
        description: '',
        duration: '1_DAY',
        workType: 'JOIN',
        paymentTime: 'DAILY',
        paymentAmount: 0
      })
    }, 2000)
  }

  if (showSuccess) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <div className="text-green-500 text-xl font-bold mb-2">
          ✓ Thank you, your task has been posted!
        </div>
        <p className="text-gray-400">
          Your task is now visible in the Task Catalog
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-6">Create New Task</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Pick a category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
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
            onChange={(e) => setFormData({ ...formData, paymentCurrency: e.target.value as PaymentCurrency })}
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
            onChange={(e) => setFormData({ ...formData, duration: e.target.value as WorkDuration })}
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
            onChange={(e) => setFormData({ ...formData, workType: e.target.value as WorkType })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
          >
            <option value="JOIN">Join</option>
            <option value="PLAY">Play</option>
            <option value="COMPLETE_REGISTRATION">Complete Registration</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Payment Time
          </label>
          <select
            value={formData.paymentTime}
            onChange={(e) => setFormData({ ...formData, paymentTime: e.target.value as PaymentTime })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="ONE_TIME">One time payment</option>
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

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-500"
        >
          Post Task
        </button>
      </form>
    </div>
  )
}