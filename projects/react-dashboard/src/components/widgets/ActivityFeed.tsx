import React from 'react'
import { CheckCircle, Plus, MessageSquare, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

const activities = [
  {
    id: '1',
    type: 'task_completed',
    description: 'completó la tarea "Implementar autenticación"',
    user: 'María García',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutos
    icon: CheckCircle,
    iconColor: 'text-green-600 bg-green-100',
  },
  {
    id: '2',
    type: 'task_created',
    description: 'creó una nueva tarea "Diseñar dashboard"',
    user: 'Carlos López',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutos
    icon: Plus,
    iconColor: 'text-blue-600 bg-blue-100',
  },
  {
    id: '3',
    type: 'comment_added',
    description: 'comentó en "API Integration"',
    user: 'Ana Martínez',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas
    icon: MessageSquare,
    iconColor: 'text-purple-600 bg-purple-100',
  },
  {
    id: '4',
    type: 'user_joined',
    description: 'se unió al equipo',
    user: 'Pedro Sánchez',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 horas
    icon: User,
    iconColor: 'text-indigo-600 bg-indigo-100',
  },
  {
    id: '5',
    type: 'task_completed',
    description: 'completó la tarea "Configurar CI/CD"',
    user: 'Laura Jiménez',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 día
    icon: CheckCircle,
    iconColor: 'text-green-600 bg-green-100',
  },
]

export const ActivityFeed: React.FC = () => {
  return (
    <div className="dashboard-card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Actividad Reciente
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${activity.iconColor} dark:bg-opacity-20`}>
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white">
                <span className="font-medium">{activity.user}</span>{' '}
                <span className="text-gray-600 dark:text-gray-400">
                  {activity.description}
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {formatDistanceToNow(activity.timestamp, {
                  addSuffix: true,
                  locale: es,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
        Ver toda la actividad →
      </button>
    </div>
  )
}