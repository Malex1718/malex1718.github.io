import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const data = [
  { month: 'Ene', actual: 4000, proyectado: 3800 },
  { month: 'Feb', actual: 4500, proyectado: 4200 },
  { month: 'Mar', actual: 5200, proyectado: 4800 },
  { month: 'Abr', actual: 4800, proyectado: 5100 },
  { month: 'May', actual: 5500, proyectado: 5400 },
  { month: 'Jun', actual: 6200, proyectado: 5800 },
  { month: 'Jul', actual: 6800, proyectado: 6300 },
]

export const RevenueChart: React.FC = () => {
  return (
    <div className="dashboard-card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Ingresos Mensuales
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis 
              dataKey="month" 
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
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6' }}
              name="Actual"
            />
            <Line
              type="monotone"
              dataKey="proyectado"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981' }}
              strokeDasharray="5 5"
              name="Proyectado"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}