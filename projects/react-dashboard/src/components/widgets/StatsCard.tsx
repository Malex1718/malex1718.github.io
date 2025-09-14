import React from 'react'
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react'
import clsx from 'clsx'

interface StatsCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: LucideIcon
  color: string
}

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
  green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
  yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
}) => {
  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          <div className={clsx('flex items-center mt-2', {
            'text-green-600 dark:text-green-400': trend === 'up',
            'text-red-600 dark:text-red-400': trend === 'down',
          })}>
            {trend === 'up' ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-medium">{change}</span>
          </div>
        </div>
        <div className={clsx('p-3 rounded-lg', colorClasses[color as keyof typeof colorClasses])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}