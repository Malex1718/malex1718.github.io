import React from 'react'
import { TrendingUp, TrendingDown, Users, ListTodo, CheckCircle, Clock } from 'lucide-react'
import { StatsCard } from './StatsCard'

const stats = [
  {
    title: 'Total de Tareas',
    value: '1,234',
    change: '+12.5%',
    trend: 'up' as const,
    icon: ListTodo,
    color: 'blue',
  },
  {
    title: 'Tareas Completadas',
    value: '892',
    change: '+8.2%',
    trend: 'up' as const,
    icon: CheckCircle,
    color: 'green',
  },
  {
    title: 'En Progreso',
    value: '256',
    change: '-2.4%',
    trend: 'down' as const,
    icon: Clock,
    color: 'yellow',
  },
  {
    title: 'Usuarios Activos',
    value: '48',
    change: '+18.7%',
    trend: 'up' as const,
    icon: Users,
    color: 'purple',
  },
]

export const StatsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          trend={stat.trend}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  )
}