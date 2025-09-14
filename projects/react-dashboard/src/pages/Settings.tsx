import React, { useState } from 'react'
import { User, Bell, Shield, Palette, Globe } from 'lucide-react'

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'language', label: 'Idioma', icon: Globe },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ajustes</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configura tu cuenta y preferencias
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="dashboard-card p-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full px-4 py-3 flex items-center space-x-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  activeTab === tab.id
                    ? 'border-l-4 border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : ''
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="dashboard-card">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Información del Perfil
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      defaultValue="Admin Demo"
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="admin@demo.com"
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Bio
                    </label>
                    <textarea
                      rows={3}
                      className="input-field"
                      defaultValue="Administrador del sistema de gestión de tareas."
                    />
                  </div>
                </div>
                
                <button className="btn-primary">
                  Guardar Cambios
                </button>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Preferencias de Notificaciones
                </h2>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Notificaciones por email
                    </span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Notificaciones push
                    </span>
                    <input type="checkbox" className="toggle" />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Resumen semanal
                    </span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Configuración de Seguridad
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Cambiar Contraseña
                    </h3>
                    <button className="btn-secondary">
                      Actualizar Contraseña
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Autenticación de Dos Factores
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Añade una capa extra de seguridad a tu cuenta
                    </p>
                    <button className="btn-primary">
                      Habilitar 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Tema y Apariencia
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tema
                    </label>
                    <select className="input-field">
                      <option>Claro</option>
                      <option>Oscuro</option>
                      <option>Sistema</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'language' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Idioma y Región
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Idioma
                    </label>
                    <select className="input-field">
                      <option>Español</option>
                      <option>English</option>
                      <option>Português</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}