import React, { useState, useEffect } from 'react'
import { sentimentService } from '@services/sentiment'
import { useConversationStore } from '@store/conversationStore'
import { SentimentAnalysis, Entity, Message, AnalysisResult } from '@types/index'
import { 
  ChartBarIcon, 
  FaceSmileIcon, 
  FaceFrownIcon,
  SparklesIcon,
  DocumentTextIcon,
  LanguageIcon,
  TagIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const AnalysisPanel: React.FC = () => {
  const [selectedText, setSelectedText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { getCurrentConversation } = useConversationStore()
  const currentConversation = getCurrentConversation()

  const handleAnalyzeText = async () => {
    if (!selectedText.trim()) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const sentiment = await sentimentService.analyzeSentiment(selectedText)
      
      // Simulate full analysis result
      const result: AnalysisResult = {
        sentiment,
        topics: extractTopics(selectedText),
        summary: generateSummary(selectedText),
        keyPhrases: extractKeyPhrases(selectedText),
      }
      
      setAnalysisResult(result)
    } catch (err) {
      setError('Failed to analyze text')
      console.error('Error analyzing text:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Helper functions for demo purposes
  const extractTopics = (text: string): string[] => {
    const commonTopics = ['technology', 'AI', 'communication', 'analysis', 'development']
    return commonTopics.filter(() => Math.random() > 0.5).slice(0, 3)
  }

  const generateSummary = (text: string): string => {
    const words = text.split(' ')
    if (words.length <= 20) return text
    return words.slice(0, 20).join(' ') + '...'
  }

  const extractKeyPhrases = (text: string): string[] => {
    const words = text.toLowerCase().split(' ')
    const phrases = []
    for (let i = 0; i < words.length - 1; i++) {
      if (Math.random() > 0.8) {
        phrases.push(`${words[i]} ${words[i + 1]}`)
      }
    }
    return phrases.slice(0, 5)
  }

  // Calculate conversation sentiment over time
  const getSentimentTimeline = () => {
    if (!currentConversation) return null

    const sentimentData = currentConversation.messages
      .filter(msg => msg.sentiment)
      .map((msg, index) => ({
        x: index,
        y: msg.sentiment!.score,
        label: msg.sentiment!.label,
      }))

    return {
      labels: sentimentData.map((_, i) => `Message ${i + 1}`),
      datasets: [
        {
          label: 'Sentiment Score',
          data: sentimentData.map(d => d.y),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        },
      ],
    }
  }

  // Calculate sentiment distribution
  const getSentimentDistribution = () => {
    if (!currentConversation) return null

    const distribution = { positive: 0, negative: 0, neutral: 0 }
    currentConversation.messages.forEach(msg => {
      if (msg.sentiment) {
        distribution[msg.sentiment.label]++
      }
    })

    return {
      labels: ['Positive', 'Negative', 'Neutral'],
      datasets: [
        {
          data: [distribution.positive, distribution.negative, distribution.neutral],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(156, 163, 175, 0.8)',
          ],
        },
      ],
    }
  }

  const sentimentIcon = (label: string) => {
    switch (label) {
      case 'positive':
        return <FaceSmileIcon className="w-8 h-8 text-green-500" />
      case 'negative':
        return <FaceFrownIcon className="w-8 h-8 text-red-500" />
      default:
        return <SparklesIcon className="w-8 h-8 text-gray-500" />
    }
  }

  const sentimentTimeline = getSentimentTimeline()
  const sentimentDistribution = getSentimentDistribution()

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Analysis Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Text Analysis
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Text to Analyze
            </label>
            <textarea
              value={selectedText}
              onChange={(e) => setSelectedText(e.target.value)}
              placeholder="Paste or type text to analyze..."
              rows={6}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg
                       text-gray-900 dark:text-gray-100 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleAnalyzeText}
            disabled={!selectedText.trim() || isAnalyzing}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 
                     hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-300 
                     dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <ChartBarIcon className="w-5 h-5" />
                <span>Analyze Text</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Sentiment Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Sentiment Analysis
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {sentimentIcon(analysisResult.sentiment.label)}
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                    {analysisResult.sentiment.label}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    Score: {(analysisResult.sentiment.score * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Confidence</p>
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${analysisResult.sentiment.magnitude * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Topics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TagIcon className="w-5 h-5" />
                Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 
                             dark:text-blue-400 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Phrases */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5" />
                Key Phrases
              </h3>
              <ul className="space-y-2">
                {analysisResult.keyPhrases.map((phrase, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300 text-sm">
                    • {phrase}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5" />
              Summary
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {analysisResult.summary}
            </p>
          </div>

          {/* Entities */}
          {analysisResult.sentiment.entities && analysisResult.sentiment.entities.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <LanguageIcon className="w-5 h-5" />
                Entities
              </h3>
              <div className="space-y-3">
                {analysisResult.sentiment.entities.map((entity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{entity.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{entity.type}</p>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Relevance: {(entity.salience * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Conversation Analytics */}
      {currentConversation && currentConversation.messages.length > 0 && (
        <div className="mt-8 space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Conversation Analytics
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sentiment Timeline */}
            {sentimentTimeline && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Sentiment Timeline
                </h4>
                <Line
                  data={sentimentTimeline}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        min: -1,
                        max: 1,
                      },
                    },
                  }}
                />
              </div>
            )}

            {/* Sentiment Distribution */}
            {sentimentDistribution && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Sentiment Distribution
                </h4>
                <Doughnut
                  data={sentimentDistribution}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalysisPanel