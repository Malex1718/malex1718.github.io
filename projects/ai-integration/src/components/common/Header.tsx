import React from 'react'
import { Brain, Moon, Sun, Github } from 'lucide-react'
import { useThemeStore } from '@store/themeStore'

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary-600 to-ai-claude p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Integration Demo
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Claude AI • ElevenLabs • Sentiment Analysis
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/malex1718/malex1718.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}