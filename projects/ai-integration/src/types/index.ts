export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  audioUrl?: string
  sentiment?: SentimentAnalysis
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface SentimentAnalysis {
  score: number // -1 to 1
  magnitude: number
  label: 'positive' | 'negative' | 'neutral'
  entities?: Entity[]
  language?: string
}

export interface Entity {
  name: string
  type: 'PERSON' | 'LOCATION' | 'ORGANIZATION' | 'OTHER'
  salience: number
}

export interface Voice {
  id: string
  name: string
  gender: 'male' | 'female'
  language: string
  preview_url?: string
}

export interface AudioSettings {
  voice: string
  speed: number
  pitch: number
}

export interface TranslationRequest {
  text: string
  targetLanguage: string
  sourceLanguage?: string
}

export interface AIModel {
  id: string
  name: string
  provider: 'anthropic' | 'openai' | 'google'
  capabilities: string[]
}

export interface AnalysisResult {
  sentiment: SentimentAnalysis
  topics: string[]
  summary: string
  keyPhrases: string[]
}