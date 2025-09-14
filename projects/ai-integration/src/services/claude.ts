import Anthropic from '@anthropic-ai/sdk'
import { Message } from '@types/index'

class ClaudeService {
  private client: Anthropic | null = null
  
  initialize(apiKey: string) {
    this.client = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true // Solo para demo, en producción usar backend
    })
  }

  async sendMessage(
    messages: Message[],
    onStream?: (chunk: string) => void
  ): Promise<string> {
    if (!this.client) {
      throw new Error('Claude API no inicializada')
    }

    try {
      // Convertir mensajes al formato de Claude
      const claudeMessages = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }))

      if (onStream) {
        // Streaming response
        const stream = await this.client.messages.create({
          model: 'claude-3-opus-20240229',
          max_tokens: 1024,
          messages: claudeMessages,
          stream: true,
        })

        let fullResponse = ''
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta') {
            const text = chunk.delta.text
            fullResponse += text
            onStream(text)
          }
        }
        return fullResponse
      } else {
        // Non-streaming response
        const response = await this.client.messages.create({
          model: 'claude-3-opus-20240229',
          max_tokens: 1024,
          messages: claudeMessages,
        })

        return response.content[0].text
      }
    } catch (error) {
      console.error('Error al llamar a Claude API:', error)
      throw error
    }
  }

  // Para demo sin API key real
  async sendMessageDemo(
    messages: Message[],
    onStream?: (chunk: string) => void
  ): Promise<string> {
    // Simular respuesta de Claude
    const lastMessage = messages[messages.length - 1].content.toLowerCase()
    
    let response = ''
    if (lastMessage.includes('hola')) {
      response = '¡Hola! Soy Claude, tu asistente de IA. ¿En qué puedo ayudarte hoy?'
    } else if (lastMessage.includes('código')) {
      response = `Por supuesto, aquí tienes un ejemplo de código en JavaScript:

\`\`\`javascript
// Función para saludar
function saludar(nombre) {
  return \`¡Hola, \${nombre}! Bienvenido\`;
}

console.log(saludar('Yahir'));
\`\`\`

¿Necesitas ayuda con algo más específico?`
    } else if (lastMessage.includes('capacidades')) {
      response = `Mis capacidades incluyen:

- 💬 Conversación natural en múltiples idiomas
- 📝 Generación y análisis de código
- 📊 Análisis de datos y estadísticas
- 🎨 Ayuda creativa y redacción
- 🧮 Resolución de problemas matemáticos
- 📚 Investigación y resúmenes
- 🌐 Traducción entre idiomas

¿Qué te gustaría explorar?`
    } else {
      response = 'Entiendo tu consulta. Déjame ayudarte con eso. ' +
        'Como asistente de IA, puedo ayudarte con una amplia variedad de tareas, ' +
        'desde responder preguntas hasta ayudarte con programación, análisis de datos, ' +
        'escritura creativa y mucho más. ¿Hay algo específico en lo que te gustaría que profundizara?'
    }

    // Simular streaming
    if (onStream) {
      const words = response.split(' ')
      for (const word of words) {
        await new Promise(resolve => setTimeout(resolve, 50))
        onStream(word + ' ')
      }
    }

    return response
  }
}

export const claudeService = new ClaudeService()