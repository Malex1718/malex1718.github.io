import { SentimentAnalysis, Entity, AnalysisResult } from '@types/index'

class SentimentService {
  // Análisis de sentimientos simple basado en palabras clave
  analyzeSentiment(text: string): SentimentAnalysis {
    const positiveWords = [
      'excelente', 'genial', 'increíble', 'fantástico', 'maravilloso', 
      'feliz', 'contento', 'alegre', 'bueno', 'perfecto', 'amor', 
      'gracias', 'mejor', 'éxito', 'logro', 'great', 'good', 'excellent',
      'happy', 'love', 'wonderful', 'amazing', 'fantastic'
    ]
    
    const negativeWords = [
      'malo', 'terrible', 'horrible', 'pésimo', 'triste', 'enojado',
      'frustrado', 'problema', 'error', 'falla', 'peor', 'odio',
      'bad', 'terrible', 'horrible', 'sad', 'angry', 'frustrated',
      'problem', 'error', 'fail', 'worst', 'hate'
    ]

    const lowerText = text.toLowerCase()
    let positiveCount = 0
    let negativeCount = 0

    positiveWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi')
      const matches = lowerText.match(regex)
      if (matches) positiveCount += matches.length
    })

    negativeWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi')
      const matches = lowerText.match(regex)
      if (matches) negativeCount += matches.length
    })

    const totalWords = text.split(/\s+/).length
    const sentimentWords = positiveCount + negativeCount
    const magnitude = sentimentWords / totalWords

    let score = 0
    let label: 'positive' | 'negative' | 'neutral' = 'neutral'

    if (positiveCount > negativeCount) {
      score = Math.min(positiveCount / (positiveCount + negativeCount), 1)
      label = score > 0.2 ? 'positive' : 'neutral'
    } else if (negativeCount > positiveCount) {
      score = -Math.min(negativeCount / (positiveCount + negativeCount), 1)
      label = score < -0.2 ? 'negative' : 'neutral'
    }

    // Detectar idioma
    const language = this.detectLanguage(text)

    // Extraer entidades
    const entities = this.extractEntities(text)

    return {
      score,
      magnitude,
      label,
      entities,
      language,
    }
  }

  // Detección simple de idioma
  private detectLanguage(text: string): string {
    const spanishPatterns = /\b(el|la|los|las|de|en|que|es|por|para|con)\b/gi
    const englishPatterns = /\b(the|of|and|to|in|is|for|with|that|on)\b/gi

    const spanishMatches = text.match(spanishPatterns)?.length || 0
    const englishMatches = text.match(englishPatterns)?.length || 0

    if (spanishMatches > englishMatches) return 'es'
    if (englishMatches > spanishMatches) return 'en'
    return 'unknown'
  }

  // Extracción simple de entidades
  private extractEntities(text: string): Entity[] {
    const entities: Entity[] = []

    // Patrones para detectar nombres (palabras capitalizadas)
    const namePattern = /\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\b/g
    const names = text.match(namePattern) || []
    
    names.forEach(name => {
      // Filtrar palabras comunes que empiezan con mayúscula
      const commonWords = ['El', 'La', 'Los', 'Las', 'The', 'A', 'An']
      if (!commonWords.includes(name)) {
        entities.push({
          name,
          type: 'PERSON',
          salience: 0.8,
        })
      }
    })

    // Patrones para lugares (simplificado)
    const locationPattern = /\b(México|España|Estados Unidos|USA|Ciudad|City|País|Country)\b/gi
    const locations = text.match(locationPattern) || []
    
    locations.forEach(location => {
      entities.push({
        name: location,
        type: 'LOCATION',
        salience: 0.7,
      })
    })

    // Patrones para organizaciones
    const orgPattern = /\b(Company|Empresa|Corporation|Corp|Inc|Ltd|LLC|SA|SL)\b/gi
    const orgs = text.match(orgPattern) || []
    
    orgs.forEach(org => {
      entities.push({
        name: org,
        type: 'ORGANIZATION',
        salience: 0.6,
      })
    })

    return entities
  }

  // Análisis completo de texto
  analyzeText(text: string): AnalysisResult {
    const sentiment = this.analyzeSentiment(text)
    const topics = this.extractTopics(text)
    const summary = this.generateSummary(text)
    const keyPhrases = this.extractKeyPhrases(text)

    return {
      sentiment,
      topics,
      summary,
      keyPhrases,
    }
  }

  // Extracción de temas
  private extractTopics(text: string): string[] {
    const topics: string[] = []
    
    // Categorías predefinidas
    const categories = {
      tecnología: ['software', 'programación', 'código', 'app', 'web', 'api', 'tecnología'],
      negocios: ['empresa', 'negocio', 'cliente', 'venta', 'proyecto', 'trabajo'],
      educación: ['aprender', 'estudiar', 'curso', 'educación', 'enseñar'],
      salud: ['salud', 'médico', 'doctor', 'hospital', 'medicina'],
    }

    const lowerText = text.toLowerCase()
    
    Object.entries(categories).forEach(([topic, keywords]) => {
      const found = keywords.some(keyword => lowerText.includes(keyword))
      if (found) topics.push(topic)
    })

    return topics.length > 0 ? topics : ['general']
  }

  // Generar resumen simple
  private generateSummary(text: string): string {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || []
    
    if (sentences.length <= 2) return text
    
    // Tomar las primeras dos oraciones como resumen
    return sentences.slice(0, 2).join(' ').trim()
  }

  // Extraer frases clave
  private extractKeyPhrases(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/)
    const stopWords = new Set([
      'el', 'la', 'de', 'en', 'y', 'a', 'que', 'es', 'por', 'para',
      'the', 'of', 'and', 'to', 'in', 'is', 'for', 'with', 'that', 'on',
      'un', 'una', 'los', 'las', 'del', 'al', 'se', 'con', 'su', 'lo'
    ])

    // Contar frecuencia de palabras
    const wordFreq = new Map<string, number>()
    
    words.forEach(word => {
      const cleanWord = word.replace(/[.,!?;:"]/g, '')
      if (cleanWord.length > 3 && !stopWords.has(cleanWord)) {
        wordFreq.set(cleanWord, (wordFreq.get(cleanWord) || 0) + 1)
      }
    })

    // Ordenar por frecuencia y tomar las top 5
    const sortedWords = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word)

    return sortedWords
  }
}

export const sentimentService = new SentimentService()