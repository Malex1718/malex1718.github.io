export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'user'
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  dueDate?: Date
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface ChartData {
  name: string
  value: number
  [key: string]: any
}

export interface DashboardStats {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  inProgressTasks: number
  totalUsers: number
  activeUsers: number
  revenue: number
  growth: number
}

export interface Activity {
  id: string
  type: 'task_created' | 'task_completed' | 'user_joined' | 'comment_added'
  description: string
  timestamp: Date
  userId: string
  userName: string
  userAvatar?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: Date
}