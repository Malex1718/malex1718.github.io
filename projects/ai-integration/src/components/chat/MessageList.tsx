import React from 'react'
import { Message } from '@types/index'
import MessageItem from './MessageItem'
import { motion, AnimatePresence } from 'framer-motion'

interface MessageListProps {
  messages: Message[]
  streamingMessage?: string
  isLoading?: boolean
}

const MessageList: React.FC<MessageListProps> = ({ messages, streamingMessage, isLoading }) => {
  return (
    <div className="space-y-4">
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <MessageItem message={message} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Streaming message */}
      {streamingMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MessageItem
            message={{
              id: 'streaming',
              role: 'assistant',
              content: streamingMessage,
              timestamp: new Date(),
            }}
            isStreaming
          />
        </motion.div>
      )}

      {/* Loading indicator */}
      {isLoading && !streamingMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-start"
        >
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default MessageList