import React, { useState, useEffect, useRef } from 'react'
import { useConversationStore } from '@store/conversationStore'
import { claudeService } from '@services/claude'
import { sentimentService } from '@services/sentiment'
import { Message } from '@types/index'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import ConversationSidebar from './ConversationSidebar'
import { PlusIcon, MenuIcon, XIcon } from '@heroicons/react/outline'

const ChatInterface: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [streamingMessage, setStreamingMessage] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    conversations,
    currentConversationId,
    getCurrentConversation,
    createConversation,
    setCurrentConversation,
    addMessage,
    updateMessage,
  } = useConversationStore()

  const currentConversation = getCurrentConversation()

  useEffect(() => {
    // Create initial conversation if none exists
    if (conversations.length === 0) {
      createConversation('New Conversation')
    }
  }, [conversations.length, createConversation])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentConversation?.messages, streamingMessage])

  const handleSendMessage = async (content: string) => {
    if (!currentConversationId || !content.trim()) return

    setError(null)
    setIsLoading(true)
    setStreamingMessage('')

    // Add user message
    addMessage(currentConversationId, {
      role: 'user',
      content,
    })

    try {
      // Prepare messages for Claude
      const messages = [...(currentConversation?.messages || []), { role: 'user', content }] as Message[]

      // Create temporary assistant message ID for streaming
      const tempMessageId = `temp-${Date.now()}`
      let fullResponse = ''

      // Add temporary assistant message
      addMessage(currentConversationId, {
        role: 'assistant',
        content: '',
      })

      // Get Claude's response with streaming
      const response = await claudeService.sendMessageDemo(
        messages,
        (chunk: string) => {
          fullResponse += chunk
          setStreamingMessage(fullResponse)
        }
      )

      // Update the assistant message with the full response
      const assistantMessages = currentConversation?.messages.filter(m => m.role === 'assistant') || []
      const lastAssistantMessage = assistantMessages[assistantMessages.length - 1]

      if (lastAssistantMessage) {
        // Analyze sentiment
        try {
          const sentimentResult = await sentimentService.analyzeSentiment(response)
          updateMessage(currentConversationId, lastAssistantMessage.id, {
            content: response,
            sentiment: sentimentResult,
          })
        } catch (sentimentError) {
          // Update without sentiment if analysis fails
          updateMessage(currentConversationId, lastAssistantMessage.id, {
            content: response,
          })
        }
      }

      setStreamingMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error sending message:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewConversation = () => {
    const title = `Conversation ${conversations.length + 1}`
    createConversation(title)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        {isSidebarOpen ? (
          <XIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        ) : (
          <MenuIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative md:translate-x-0 transition-transform duration-300 z-40 h-full`}
      >
        <ConversationSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={setCurrentConversation}
          onNewConversation={handleNewConversation}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Chat header */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentConversation?.title || 'Chat with Claude'}
            </h2>
            <button
              onClick={handleNewConversation}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
              Error: {error}
            </div>
          )}

          {currentConversation ? (
            <>
              <MessageList
                messages={currentConversation.messages}
                streamingMessage={streamingMessage}
                isLoading={isLoading}
              />
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">
                Select a conversation or create a new one to start chatting
              </p>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={!currentConversationId}
          />
        </div>
      </div>
    </div>
  )
}

export default ChatInterface