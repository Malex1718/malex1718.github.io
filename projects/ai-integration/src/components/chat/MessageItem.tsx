import React, { useState } from 'react'
import { Message } from '@types/index'
import { format } from 'date-fns'
import { UserIcon, SpeakerWaveIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/24/solid'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MessageItemProps {
  message: Message
  isStreaming?: boolean
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isStreaming }) => {
  const [isCopied, setIsCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleSpeak = () => {
    // This will be implemented with ElevenLabs integration
    console.log('Speaking message:', message.content)
  }

  const getSentimentColor = () => {
    if (!message.sentiment) return ''
    const { label } = message.sentiment
    switch (label) {
      case 'positive':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20'
      case 'negative':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20'
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-800'
    }
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-3xl ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-white'
          }`}
        >
          {isUser ? (
            <UserIcon className="w-6 h-6" />
          ) : (
            <span className="font-bold text-sm">AI</span>
          )}
        </div>

        {/* Message content */}
        <div className="flex-1">
          <div
            className={`rounded-lg px-4 py-3 ${
              isUser
                ? 'bg-blue-600 text-white'
                : `bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 ${
                    message.sentiment ? getSentimentColor() : 'border-gray-200 dark:border-gray-700'
                  }`
            } ${isStreaming ? 'animate-pulse' : ''}`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm" {...props}>
                          {children}
                        </code>
                      )
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Message metadata and actions */}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(message.timestamp), 'HH:mm')}
            </span>

            {message.sentiment && (
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Sentiment: <span className="font-medium capitalize">{message.sentiment.label}</span>
                {' '}({(message.sentiment.score * 100).toFixed(0)}%)
              </span>
            )}

            {!isUser && !isStreaming && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title="Copy message"
                >
                  {isCopied ? (
                    <CheckIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <ClipboardDocumentIcon className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={handleSpeak}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title="Read aloud"
                >
                  <SpeakerWaveIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageItem