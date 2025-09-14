import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © 2024 React Dashboard Demo. Todos los derechos reservados.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-0">
          Desarrollado por{' '}
          <a 
            href="https://malex1718.github.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            Yahir Muñoz
          </a>
        </p>
      </div>
    </footer>
  )
}