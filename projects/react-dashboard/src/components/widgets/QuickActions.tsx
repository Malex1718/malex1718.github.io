import React from 'react'
import { Plus, Upload, Download, Settings } from 'lucide-react'

const actions = [
  {
    label: 'Nueva Tarea',
    icon: Plus,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    label: 'Importar Datos',
    icon: Upload,
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    label: 'Exportar Reporte',
    icon: Download,
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    label: 'Configuración',
    icon: Settings,
    color: 'bg-gray-500 hover:bg-gray-600',
  },
]

export const QuickActions: React.FC = () => {
  return (
    <div className="dashboard-card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Acciones Rápidas
      </h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-white font-medium transition-colors ${action.color}`}
          >
            <action.icon className="h-5 w-5" />
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}