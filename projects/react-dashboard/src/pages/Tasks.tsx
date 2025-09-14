import React, { useState } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { TasksTable } from '@components/widgets/TasksTable'
import { TaskFilters } from '@components/widgets/TaskFilters'

export const Tasks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tareas</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona todas las tareas del equipo
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Nueva Tarea</span>
        </button>
      </div>

      <div className="dashboard-card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar tareas..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-primary flex items-center space-x-2"
          >
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </button>
        </div>

        {showFilters && <TaskFilters />}

        <TasksTable searchTerm={searchTerm} />
      </div>
    </div>
  )
}