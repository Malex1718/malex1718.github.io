import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Download } from 'lucide-react'

const pieData = [
  { name: 'Completadas', value: 400, color: '#10b981' },
  { name: 'En Progreso', value: 300, color: '#f59e0b' },
  { name: 'Pendientes', value: 200, color: '#ef4444' },
  { name: 'Canceladas', value: 100, color: '#6b7280' },
]

const areaData = [
  { mes: 'Ene', productividad: 65 },
  { mes: 'Feb', productividad: 68 },
  { mes: 'Mar', productividad: 72 },
  { mes: 'Abr', productividad: 70 },
  { mes: 'May', productividad: 75 },
  { mes: 'Jun', productividad: 78 },
  { mes: 'Jul', productividad: 82 },
]

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Análisis detallado del rendimiento
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>Exportar Reporte</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Distribución de Tareas
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Índice de Productividad
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                  dataKey="mes" 
                  className="text-gray-600 dark:text-gray-400"
                  stroke="currentColor"
                />
                <YAxis 
                  className="text-gray-600 dark:text-gray-400"
                  stroke="currentColor"
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="productividad"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="dashboard-card">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Promedio de Finalización</h4>
          <p className="text-3xl font-bold text-primary-600">3.5 días</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">-0.5 días vs mes anterior</p>
        </div>
        <div className="dashboard-card">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tasa de Éxito</h4>
          <p className="text-3xl font-bold text-green-600">87%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">+5% vs mes anterior</p>
        </div>
        <div className="dashboard-card">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tareas por Usuario</h4>
          <p className="text-3xl font-bold text-blue-600">25.7</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Promedio mensual</p>
        </div>
      </div>
    </div>
  )
}