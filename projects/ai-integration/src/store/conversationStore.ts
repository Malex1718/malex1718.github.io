import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Conversation, Message } from '@types/index'
import { v4 as uuidv4 } from 'uuid'

interface ConversationStore {
  conversations: Conversation[]
  currentConversationId: string | null
  
  // Actions
  createConversation: (title: string) => string
  deleteConversation: (id: string) => void
  setCurrentConversation: (id: string) => void
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void
  clearConversations: () => void
  getCurrentConversation: () => Conversation | undefined
}

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,

      createConversation: (title: string) => {
        const newConversation: Conversation = {
          id: uuidv4(),
          title,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set(state => ({
          conversations: [...state.conversations, newConversation],
          currentConversationId: newConversation.id,
        }))

        return newConversation.id
      },

      deleteConversation: (id: string) => {
        set(state => ({
          conversations: state.conversations.filter(c => c.id !== id),
          currentConversationId: 
            state.currentConversationId === id 
              ? state.conversations[0]?.id || null 
              : state.currentConversationId,
        }))
      },

      setCurrentConversation: (id: string) => {
        set({ currentConversationId: id })
      },

      addMessage: (conversationId: string, message) => {
        const newMessage: Message = {
          ...message,
          id: uuidv4(),
          timestamp: new Date(),
        }

        set(state => ({
          conversations: state.conversations.map(conv => 
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, newMessage],
                  updatedAt: new Date(),
                }
              : conv
          ),
        }))
      },

      updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => {
        set(state => ({
          conversations: state.conversations.map(conv => 
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.map(msg => 
                    msg.id === messageId
                      ? { ...msg, ...updates }
                      : msg
                  ),
                  updatedAt: new Date(),
                }
              : conv
          ),
        }))
      },

      clearConversations: () => {
        set({
          conversations: [],
          currentConversationId: null,
        })
      },

      getCurrentConversation: () => {
        const state = get()
        return state.conversations.find(c => c.id === state.currentConversationId)
      },
    }),
    {
      name: 'ai-conversations',
    }
  )
)