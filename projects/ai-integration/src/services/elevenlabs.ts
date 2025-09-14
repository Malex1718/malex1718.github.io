import axios from 'axios'
import { Voice, AudioSettings } from '@types/index'

class ElevenLabsService {
  private apiKey: string = ''
  private baseUrl = 'https://api.elevenlabs.io/v1'

  initialize(apiKey: string) {
    this.apiKey = apiKey
  }

  async getVoices(): Promise<Voice[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      })
      
      return response.data.voices.map((voice: any) => ({
        id: voice.voice_id,
        name: voice.name,
        gender: voice.labels?.gender || 'male',
        language: voice.labels?.language || 'en',
        preview_url: voice.preview_url,
      }))
    } catch (error) {
      console.error('Error al obtener voces:', error)
      return this.getDemoVoices()
    }
  }

  async textToSpeech(
    text: string,
    settings: AudioSettings
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${settings.voice}`,
        {
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            speed: settings.speed,
            pitch: settings.pitch,
          },
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        }
      )

      // Convertir a blob URL
      const blob = new Blob([response.data], { type: 'audio/mpeg' })
      return URL.createObjectURL(blob)
    } catch (error) {
      console.error('Error en text-to-speech:', error)
      // Para demo, usar Web Speech API
      return this.textToSpeechDemo(text, settings)
    }
  }

  // Funciones demo sin API key
  private getDemoVoices(): Voice[] {
    return [
      {
        id: 'demo-male-1',
        name: 'Carlos (Demo)',
        gender: 'male',
        language: 'es',
      },
      {
        id: 'demo-female-1',
        name: 'María (Demo)',
        gender: 'female',
        language: 'es',
      },
      {
        id: 'demo-male-2',
        name: 'James (Demo)',
        gender: 'male',
        language: 'en',
      },
      {
        id: 'demo-female-2',
        name: 'Sarah (Demo)',
        gender: 'female',
        language: 'en',
      },
    ]
  }

  private async textToSpeechDemo(
    text: string,
    settings: AudioSettings
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      // Usar Web Speech API como fallback
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = settings.speed
      utterance.pitch = settings.pitch
      
      // Seleccionar voz según el idioma
      const voices = speechSynthesis.getVoices()
      const selectedVoice = voices.find(v => 
        settings.voice.includes('female') ? v.name.includes('Female') : v.name.includes('Male')
      ) || voices[0]
      
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }

      // Crear audio URL simulado
      const audioContext = new AudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 440
      gainNode.gain.value = 0.1
      
      oscillator.start()
      setTimeout(() => oscillator.stop(), 100)

      // Hablar el texto
      speechSynthesis.speak(utterance)

      // Retornar URL simulado
      resolve('demo-audio-url')
    })
  }

  downloadAudio(audioUrl: string, filename: string = 'audio.mp3') {
    const a = document.createElement('a')
    a.href = audioUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

export const elevenLabsService = new ElevenLabsService()