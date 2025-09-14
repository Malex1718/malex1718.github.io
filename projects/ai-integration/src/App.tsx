import React, { useState, useEffect } from 'react'
import { ChatInterface } from '@components/chat/ChatInterface'
import { VoicePanel } from '@components/voice/VoicePanel'
import { AnalysisPanel } from '@components/analysis/AnalysisPanel'
import { Header } from '@components/common/Header'
import { TabPanel } from '@components/common/TabPanel'
import { useConversationStore } from '@store/conversationStore'
import { useThemeStore } from '@store/themeStore'
import { claudeService } from '@services/claude'
import { elevenLabsService } from '@services/elevenlabs'

function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'voice' | 'analysis'>('chat')
  const { theme } = useThemeStore()

  useEffect(() => {
    // Aplicar tema
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)

    // Inicializar servicios (en producción usar variables de entorno)
    const claudeApiKey = import.meta.env.VITE_CLAUDE_API_KEY || ''
    const elevenLabsApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || ''
    
    if (claudeApiKey) claudeService.initialize(claudeApiKey)
    if (elevenLabsApiKey) elevenLabsService.initialize(elevenLabsApiKey)
  }, [theme])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-1 flex space-x-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Chat AI
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'voice'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Text to Speech
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'analysis'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Análisis
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          <TabPanel value="chat" activeValue={activeTab}>
            <ChatInterface />
          </TabPanel>
          <TabPanel value="voice" activeValue={activeTab}>
            <VoicePanel />
          </TabPanel>
          <TabPanel value="analysis" activeValue={activeTab}>
            <AnalysisPanel />
          </TabPanel>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-600 dark:text-gray-400">
        <p>
          Demo de integración con IA por{' '}
          <a
            href="https://malex1718.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            Yahir Muñoz
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App