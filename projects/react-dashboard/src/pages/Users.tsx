import React from 'react'
import { UserPlus, Search, MoreVertical, Mail, Edit, Trash2 } from 'lucide-react'

const users = [
  {
    id: 1,
    name: 'María García',
    email: 'maria.garcia@example.com',
    role: 'Admin',
    status: 'Activo',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
  },
  {
    id: 2,
    name: 'Carlos López',
    email: 'carlos.lopez@example.com',
    role: 'Editor',
    status: 'Activo',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos'
  },
  {
    id: 3,
    name: 'Ana Martínez',
    email: 'ana.martinez@example.com',
    role: 'Usuario',
    status: 'Inactivo',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana'
  },
]

export const Users: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Usuarios</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <UserPlus className="h-5 w-5" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      <div className="dashboard-card">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4">Usuario</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Rol</th>
                <th className="text-left py-3 px-4">Estado</th>
                <th className="text-left py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'Activo'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-500 hover:text-primary-600">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="text-gray-500 hover:text-primary-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}