import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400">
          404
        </h1>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">
          Página no encontrada
        </p>
        <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex items-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Ir al Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  )
}