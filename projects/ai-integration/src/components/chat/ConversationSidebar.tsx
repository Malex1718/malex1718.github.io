import React, { useState } from 'react'
import { Conversation } from '@types/index'
import { format } from 'date-fns'
import { 
  ChatBubbleLeftRightIcon, 
  PlusIcon, 
  TrashIcon, 
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useConversationStore } from '@store/conversationStore'

interface ConversationSidebarProps {
  conversations: Conversation[]
  currentConversationId: string | null
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const { deleteConversation } = useConversationStore()

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleEditTitle = (conversation: Conversation) => {
    setEditingId(conversation.id)
    setEditingTitle(conversation.title)
  }

  const handleSaveTitle = (conversationId: string) => {
    // In a real implementation, this would update the conversation title
    console.log('Updating title for:', conversationId, 'to:', editingTitle)
    setEditingId(null)
    setEditingTitle('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  const handleDeleteConversation = (id: string) => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      deleteConversation(id)
    }
  }

  const getConversationPreview = (conversation: Conversation) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1]
    if (!lastMessage) return 'No messages yet'
    return lastMessage.content.slice(0, 50) + (lastMessage.content.length > 50 ? '...' : '')
  }

  return (
    <div className="w-80 h-full bg-gray-100 dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 
                   text-white rounded-lg transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Conversation</span>
        </button>

        {/* Search */}
        <div className="mt-4 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 rounded-lg
                     text-gray-900 dark:text-gray-100 placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div
                  className={`group relative px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer
                           transition-colors duration-200 ${
                             currentConversationId === conversation.id
                               ? 'bg-gray-200 dark:bg-gray-700 border-l-4 border-blue-600'
                               : ''
                           }`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="flex items-start gap-3">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      {editingId === conversation.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 px-2 py-1 bg-white dark:bg-gray-600 rounded
                                     text-sm text-gray-900 dark:text-gray-100
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSaveTitle(conversation.id)
                            }}
                            className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCancelEdit()
                            }}
                            className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {conversation.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                            {getConversationPreview(conversation)}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {format(new Date(conversation.updatedAt), 'MMM d, HH:mm')}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  {!editingId && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                  flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditTitle(conversation)
                        }}
                        className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                                 dark:hover:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 
                                 rounded transition-colors"
                        title="Rename"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteConversation(conversation.id)
                        }}
                        className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 
                                 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 
                                 rounded transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
        {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}

export default ConversationSidebar