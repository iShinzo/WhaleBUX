import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useUserStore } from './userStore'

export type TaskType = 'AIRDROP' | 'CHANNEL_JOIN'
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DENIED'

export interface Task {
  id: string
  type: TaskType
  title: string
  description: string
  reward: number
  creatorId: string
  status: TaskStatus
  assignedTo?: string
  createdAt: string
  completedAt?: string
}

interface TaskState {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'status' | 'createdAt' | 'creatorId'>) => void
  getAvailableTasks: (userId: string) => Task[]
  getMyTasks: (userId: string) => Task[]
  getPendingTasksCount: (userId: string) => number
  getActiveTasksCount: (userId: string) => number
  getTaskBoostPoints: (userId: string) => number
  applyForTask: (taskId: string, userId: string) => void
  approveTask: (taskId: string) => void
  denyTask: (taskId: string) => void
  deleteTask: (taskId: string) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (taskData) => {
        const newTask: Task = {
          id: Math.random().toString(36).substr(2, 9),
          creatorId: useUserStore.getState().username,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          ...taskData
        }
        set(state => ({ tasks: [...state.tasks, newTask] }))
      },

      getAvailableTasks: (userId) => {
        return get().tasks.filter(task => 
          task.status === 'PENDING' && 
          task.creatorId !== userId &&
          task.assignedTo !== userId
        )
      },

      getMyTasks: (userId) => {
        return get().tasks.filter(task =>
          task.assignedTo === userId ||
          task.creatorId === userId
        )
      },

      getPendingTasksCount: (userId) => {
        return get().tasks.filter(task =>
          task.status === 'PENDING' &&
          task.assignedTo === userId
        ).length
      },

      getActiveTasksCount: (userId) => {
        return get().tasks.filter(task =>
          task.status === 'IN_PROGRESS' &&
          task.assignedTo === userId
        ).length
      },

      getTaskBoostPoints: (userId) => {
        return get().tasks.filter(task =>
          task.status === 'COMPLETED' &&
          task.assignedTo === userId
        ).length * 5 // 5 points per completed task
      },

      applyForTask: (taskId, userId) => {
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === taskId
              ? {
                  ...task,
                  status: 'IN_PROGRESS',
                  assignedTo: userId
                }
              : task
          )
        }))
      },

      approveTask: (taskId) => {
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === taskId
              ? {
                  ...task,
                  status: 'COMPLETED',
                  completedAt: new Date().toISOString()
                }
              : task
          )
        }))
      },

      denyTask: (taskId) => {
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === taskId
              ? {
                  ...task,
                  status: 'DENIED',
                  assignedTo: undefined
                }
              : task
          )
        }))
      },

      deleteTask: (taskId) => {
        set(state => ({
          tasks: state.tasks.filter(task => task.id !== taskId)
        }))
      }
    }),
    {
      name: 'task-storage'
    }
  )
)