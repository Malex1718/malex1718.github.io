import React from 'react'
import { MoreVertical, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface Task {
  id: string
  title: string
  assignee: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate: string
}

interface TasksTableProps {
  searchTerm?: string
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implementar autenticación',
    assignee: 'María García',
    status: 'completed',
    priority: 'high',
    dueDate: '2024-01-15',
  },
  {
    id: '2',
    title: 'Diseñar dashboard',
    assignee: 'Carlos López',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2024-01-20',
  },
  {
    id: '3',
    title: 'Optimizar queries',
    assignee: 'Ana Martínez',
    status: 'pending',
    priority: 'low',
    dueDate: '2024-01-25',
  },
]

const statusIcons = {
  pending: <AlertCircle className="h-4 w-4 text-gray-500" />,
  in_progress: <Clock className="h-4 w-4 text-blue-500" />,
  completed: <CheckCircle className="h-4 w-4 text-green-500" />,
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

export const TasksTable: React.FC<TasksTableProps> = ({ searchTerm = '' }) => {
  const filteredTasks = mockTasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4">Tarea</th>
            <th className="text-left py-3 px-4">Asignado a</th>
            <th className="text-left py-3 px-4">Estado</th>
            <th className="text-left py-3 px-4">Prioridad</th>
            <th className="text-left py-3 px-4">Fecha límite</th>
            <th className="text-left py-3 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr
              key={task.id}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="py-3 px-4">
                <div className="font-medium text-gray-900 dark:text-white">
                  {task.title}
                </div>
              </td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                {task.assignee}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  {statusIcons[task.status]}
                  <span className="text-sm capitalize">{task.status.replace('_', ' ')}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                {new Date(task.dueDate).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}