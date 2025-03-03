import { useState } from 'react'
import { WebApp } from '@twa-dev/sdk'
import { useUserStore } from '../../stores/userStore'

interface AddFriendFormProps {
  onClose: () => void
}

export default function AddFriendForm({ onClose }: AddFriendFormProps) {
  const [username, setUsername] = useState('')
  const addFriend = useUserStore((state) => state.addFriend)
  const calculateReferralBoost = useUserStore((state) => state.calculateReferralBoost)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim()) return

    const newFriend = {
      id: Math.random().toString(36).substr(2, 9),
      username: username.trim(),
      level: 1,
      joinedAt: new Date().toISOString()
    }

    addFriend(newFriend)
    calculateReferralBoost()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Friend</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telegram Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="@username"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Friend
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}