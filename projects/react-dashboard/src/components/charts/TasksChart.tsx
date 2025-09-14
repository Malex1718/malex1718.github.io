import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const data = [
  { dia: 'Lun', completadas: 24, pendientes: 12, enProgreso: 8 },
  { dia: 'Mar', completadas: 28, pendientes: 15, enProgreso: 10 },
  { dia: 'Mie', completadas: 32, pendientes: 8, enProgreso: 12 },
  { dia: 'Jue', completadas: 25, pendientes: 20, enProgreso: 15 },
  { dia: 'Vie', completadas: 35, pendientes: 10, enProgreso: 8 },
  { dia: 'Sab', completadas: 18, pendientes: 5, enProgreso: 3 },
  { dia: 'Dom', completadas: 12, pendientes: 8, enProgreso: 2 },
]

export const TasksChart: React.FC = () => {
  return (
    <div className="dashboard-card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Tareas por Estado
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis 
              dataKey="dia" 
              className="text-gray-600 dark:text-gray-400"
              stroke="currentColor"
            />
            <YAxis 
              className="text-gray-600 dark:text-gray-400"
              stroke="currentColor"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend />
            <Bar 
              dataKey="completadas" 
              fill="#10b981" 
              name="Completadas"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="enProgreso" 
              fill="#f59e0b" 
              name="En Progreso"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="pendientes" 
              fill="#ef4444" 
              name="Pendientes"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}