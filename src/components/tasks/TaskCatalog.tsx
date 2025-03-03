import { useUserStore } from '../../stores/userStore'
import { useTaskStore } from '../../stores/taskStore'

export default function TaskCatalog() {
  const { username } = useUserStore()
  const { 
    getAvailableTasks, 
    getMyTasks, 
    getPendingTasksCount,
    getActiveTasksCount,
    getTaskBoostPoints,
    applyForTask 
  } = useTaskStore()

  const availableTasks = getAvailableTasks(username)
  const myTasks = getMyTasks(username)
  const pendingCount = getPendingTasksCount(username)
  const activeCount = getActiveTasksCount(username)
  const boostPoints = getTaskBoostPoints(username)

  return (
    <div className="space-y-6">
      {/* Task Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Pending Tasks</div>
          <div className="text-xl font-bold text-white">{pendingCount}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Active Tasks</div>
          <div className="text-xl font-bold text-white">{activeCount}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Boost Points</div>
          <div className="text-xl font-bold text-green-500">{boostPoints}</div>
        </div>
      </div>

      {/* My Tasks Section */}
      {myTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">
            My Tasks
          </h2>
          <div className="space-y-4">
            {myTasks.map(task => (
              <div
                key={task.id}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white">{task.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                    <div className="mt-2">
                      <span className="text-green-500 font-medium">
                        Reward: ${task.reward}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    task.status === 'COMPLETED'
                      ? 'bg-green-900 text-green-200'
                      : task.status === 'DENIED'
                      ? 'bg-red-900 text-red-200'
                      : task.status === 'IN_PROGRESS'
                      ? 'bg-yellow-900 text-yellow-200'
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Tasks Section */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">
          Available Tasks
        </h2>
        {availableTasks.length > 0 ? (
          <div className="space-y-4">
            {availableTasks.map(task => (
              <div
                key={task.id}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white">{task.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                    <div className="mt-2">
                      <span className="text-green-500 font-medium">
                        Reward: ${task.reward}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => applyForTask(task.id, username)}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No tasks available at the moment. Check back later!
          </div>
        )}
      </div>
    </div>
  )
}