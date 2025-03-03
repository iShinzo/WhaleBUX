import { useUserStore } from '../../stores/userStore'
import { useTaskStore, Task } from '../../stores/taskStore'

interface TaskListProps {
  tasks: Task[]
}

export default function TaskList({ tasks }: TaskListProps) {
  const { username } = useUserStore()
  const { approveTask, denyTask, deleteTask } = useTaskStore()

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No tasks available. Create a new task to get started!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-gray-800 rounded-lg p-4 border border-gray-700"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-white">{task.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{task.description}</p>
              
              {task.assignedTo && (
                <p className="text-sm text-blue-400 mt-1">
                  Assigned to: @{task.assignedTo}
                </p>
              )}

              <div className="mt-2">
                <span className="text-green-500 font-medium">
                  Reward: ${task.reward}
                </span>
              </div>

              <div className="mt-2">
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

            {task.creatorId === username && (
              <div className="flex flex-col gap-2">
                {task.status === 'IN_PROGRESS' && (
                  <>
                    <button
                      onClick={() => approveTask(task.id)}
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => denyTask(task.id)}
                      className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                    >
                      Deny
                    </button>
                  </>
                )}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-sm text-red-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}