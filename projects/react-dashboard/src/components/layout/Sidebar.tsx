import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ListTodo, 
  BarChart3, 
  Users, 
  Settings,
  X
} from 'lucide-react'
import clsx from 'clsx'

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Tareas', href: '/tasks', icon: ListTodo },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Usuarios', href: '/users', icon: Users },
  { name: 'Ajustes', href: '/settings', icon: Settings },
]

export const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        {
          'translate-x-0': open,
          '-translate-x-full': !open,
        }
      )}>
        <div className="flex items-center justify-between h-16 px-6 bg-primary-600 dark:bg-primary-700">
          <h2 className="text-xl font-semibold text-white">Dashboard</h2>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-6">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                clsx(
                  'flex items-center px-4 py-3 mt-2 rounded-lg transition-colors',
                  {
                    'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300': isActive,
                    'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700': !isActive,
                  }
                )
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Demo creado por
            </p>
            <p className="font-semibold text-gray-800 dark:text-white">
              Yahir Muñoz
            </p>
          </div>
        </div>
      </div>
    </>
  )
}