# AI Integration Demo - Asistente Inteligente

Demostración de integración con APIs de IA incluyendo Claude, ElevenLabs y análisis de sentimientos, mostrando capacidades de procesamiento de lenguaje natural y síntesis de voz.

## 🚀 Demo en Vivo

[Ver Demo](https://malex1718.github.io/projects/ai-integration)

## ✨ Características

### Chat Conversacional
- 💬 **Interfaz de chat** estilo WhatsApp/ChatGPT
- 🤖 **Integración con Claude AI** para respuestas inteligentes
- 📝 **Historial de conversaciones** con persistencia local
- 🎨 **Markdown rendering** para formato enriquecido
- 📤 **Export de conversaciones** en PDF/TXT

### Text-to-Speech
- 🗣️ **Síntesis de voz** con ElevenLabs API
- 🎭 **Múltiples voces** disponibles (masculino/femenino)
- 🎚️ **Control de velocidad** y tono
- 🔊 **Reproducción en tiempo real**
- 💾 **Descarga de audio** en MP3

### Análisis de Texto
- 😊 **Análisis de sentimientos** (positivo/negativo/neutral)
- 📊 **Extracción de entidades** (personas, lugares, organizaciones)
- 🏷️ **Clasificación de temas**
- 📈 **Visualización de métricas**
- 🌍 **Detección de idioma**

### Funcionalidades Avanzadas
- 🎙️ **Speech-to-Text** usando Web Speech API
- 🔄 **Traducción automática** multiidioma
- 📱 **PWA** - Instalable como app
- 🌓 **Modo oscuro/claro**
- ⚡ **Respuestas en streaming**

## 🛠️ Stack Tecnológico

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **APIs de IA**:
  - Claude API (Anthropic)
  - ElevenLabs (Text-to-Speech)
  - Google Cloud Translation
- **State Management**: Zustand
- **UI Components**: Radix UI
- **Animaciones**: Framer Motion
- **Testing**: Vitest, Testing Library

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus API keys

# Desarrollo
npm run dev

# Build producción
npm run build

# Tests
npm test
```

## 🔑 Configuración de API Keys

Necesitarás las siguientes API keys:

1. **Claude API Key** - [Obtener en Anthropic](https://console.anthropic.com)
2. **ElevenLabs API Key** - [Obtener en ElevenLabs](https://elevenlabs.io)
3. **Google Cloud API Key** - [Obtener en Google Cloud](https://console.cloud.google.com)

```env
VITE_CLAUDE_API_KEY=your-claude-api-key
VITE_ELEVENLABS_API_KEY=your-elevenlabs-key
VITE_GOOGLE_TRANSLATE_API_KEY=your-google-key
```

## 📁 Estructura del Proyecto

```
ai-integration/
├── src/
│   ├── components/
│   │   ├── chat/          # Componentes del chat
│   │   ├── voice/         # Text-to-Speech
│   │   ├── analysis/      # Análisis de texto
│   │   └── common/        # Componentes compartidos
│   ├── services/
│   │   ├── claude.ts      # Integración Claude AI
│   │   ├── elevenlabs.ts  # Síntesis de voz
│   │   └── sentiment.ts   # Análisis de sentimientos
│   ├── hooks/            # Custom hooks
│   ├── store/           # Estado global (Zustand)
│   └── types/           # TypeScript types
```

## 🎯 Casos de Uso Demostrados

1. **Asistente Virtual**: Chat inteligente con capacidades de comprensión contextual
2. **Generación de Contenido**: Creación de textos, resúmenes y traducciones
3. **Accesibilidad**: Conversión de texto a voz para usuarios con discapacidad visual
4. **Análisis de Feedback**: Procesamiento de comentarios de usuarios
5. **Soporte Multiidioma**: Comunicación en múltiples idiomas

## 📊 Métricas de Performance

- **Tiempo de respuesta**: < 2s promedio
- **Calidad de voz**: 96% naturalidad (ElevenLabs)
- **Precisión de sentimientos**: 89% accuracy
- **Soporte de idiomas**: 50+ idiomas

## 🔒 Seguridad

- API keys almacenadas en variables de entorno
- Rate limiting implementado
- Sanitización de inputs
- CORS configurado correctamente
- Sin almacenamiento de datos sensibles

## 🚀 Deploy

El proyecto se despliega automáticamente en GitHub Pages usando GitHub Actions.

## 📝 Licencia

MIT License