import React, { useState, useRef, useEffect } from 'react'
import { elevenLabsService } from '@services/elevenlabs'
import { Voice, AudioSettings } from '@types/index'
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon,
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  XMarkIcon
} from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'

const VoicePanel: React.FC = () => {
  const [voices, setVoices] = useState<Voice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  const [text, setText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    voice: '',
    speed: 1.0,
    pitch: 1.0,
  })
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    loadVoices()
  }, [])

  const loadVoices = async () => {
    try {
      const availableVoices = await elevenLabsService.getVoicesDemo()
      setVoices(availableVoices)
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].id)
        setAudioSettings(prev => ({ ...prev, voice: availableVoices[0].id }))
      }
    } catch (err) {
      setError('Failed to load voices')
      console.error('Error loading voices:', err)
    }
  }

  const handleGenerateAudio = async () => {
    if (!text.trim() || !selectedVoice) return

    setIsGenerating(true)
    setError(null)

    try {
      const audioBlob = await elevenLabsService.textToSpeechDemo(text, selectedVoice)
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
      
      // Auto-play after generation
      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (err) {
      setError('Failed to generate audio')
      console.error('Error generating audio:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleDownload = () => {
    if (!audioUrl) return

    const a = document.createElement('a')
    a.href = audioUrl
    a.download = `voice-${Date.now()}.mp3`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleVoicePreview = async (voiceId: string) => {
    try {
      const previewText = "Hello! This is a preview of my voice. I hope you like how I sound!"
      const audioBlob = await elevenLabsService.textToSpeechDemo(previewText, voiceId)
      const url = URL.createObjectURL(audioBlob)
      
      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.play()
      }
    } catch (err) {
      console.error('Error previewing voice:', err)
    }
  }

  const characterCount = text.length
  const wordCount = text.trim().split(/\s+/).length
  const estimatedDuration = Math.ceil(wordCount / 150 * 60) // Assuming 150 words per minute

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Text to Speech
        </h2>

        {/* Voice Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Voice
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {voices.map((voice) => (
              <motion.div
                key={voice.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedVoice === voice.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => {
                  setSelectedVoice(voice.id)
                  setAudioSettings(prev => ({ ...prev, voice: voice.id }))
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {voice.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {voice.gender} • {voice.language}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleVoicePreview(voice.id)
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                             dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 
                             rounded-full transition-colors"
                    title="Preview voice"
                  >
                    <SpeakerWaveIcon className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            rows={6}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg
                     text-gray-900 dark:text-gray-100 placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{characterCount} characters • {wordCount} words</span>
            <span>Est. duration: {estimatedDuration}s</span>
          </div>
        </div>

        {/* Audio Settings */}
        <div className="mb-6">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 
                     dark:hover:text-gray-100 transition-colors"
          >
            <Cog6ToothIcon className="w-5 h-5" />
            <span>Audio Settings</span>
          </button>
          
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-4 overflow-hidden"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Speed: {audioSettings.speed.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={audioSettings.speed}
                    onChange={(e) => setAudioSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pitch: {audioSettings.pitch.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={audioSettings.pitch}
                    onChange={(e) => setAudioSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleGenerateAudio}
            disabled={!text.trim() || !selectedVoice || isGenerating}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 
                     hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-300 
                     dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <SpeakerWaveIcon className="w-5 h-5" />
                <span>Generate Audio</span>
              </>
            )}
          </button>

          {audioUrl && (
            <>
              <button
                onClick={handlePlayPause}
                className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <PauseIcon className="w-5 h-5" />
                ) : (
                  <PlayIcon className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={handleDownload}
                className="p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                title="Download audio"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Audio Player (hidden) */}
        <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      </div>

      {/* Recent Generations */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recent Generations
        </h3>
        <div className="space-y-3">
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No recent generations yet. Generate some audio to see them here!
          </p>
        </div>
      </div>
    </div>
  )
}

export default VoicePanel