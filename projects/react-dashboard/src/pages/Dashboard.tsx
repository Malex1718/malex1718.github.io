import React from 'react'
import { StatsGrid } from '@components/widgets/StatsGrid'
import { RevenueChart } from '@components/charts/RevenueChart'
import { TasksChart } from '@components/charts/TasksChart'
import { ActivityFeed } from '@components/widgets/ActivityFeed'
import { QuickActions } from '@components/widgets/QuickActions'

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Bienvenido de vuelta, aquí está el resumen de tu actividad
        </p>
      </div>

      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <TasksChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}