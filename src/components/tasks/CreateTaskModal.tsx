import { useState } from 'react'
import { useTaskStore, TaskType } from '../../stores/taskStore'

interface CreateTaskModalProps {
  onClose: () => void
}

export default function CreateTaskModal({ onClose }: CreateTaskModalProps) {
  const addTask = useTaskStore(state => state.addTask)
  const [taskData, setTaskData] = useState({
    type: 'AIRDROP' as TaskType,
    title: '',
    description: '',
    reward: 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskData.title || !taskData.description || taskData.reward <= 0) return
    
    addTask(taskData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Create New Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Type
            </label>
            <select
              value={taskData.type}
              onChange={(e) => setTaskData({ ...taskData, type: e.target.value as TaskType })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
            >
              <option value="AIRDROP">Airdrop Bot Game</option>
              <option value="CHANNEL_JOIN">Channel Join</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
              placeholder="Enter task title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
              rows={3}
              placeholder="Enter task description"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Reward (WBUX $)
            </label>
            <input
              type="number"
              value={taskData.reward}
              onChange={(e) => setTaskData({ ...taskData, reward: Number(e.target.value) })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
              min="0"
              step="0.1"
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}