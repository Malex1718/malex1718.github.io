# React Dashboard - Sistema de Analytics

Dashboard interactivo desarrollado con React, TypeScript y Tailwind CSS, demostrando componentes reutilizables y gestión de estado moderna.

## 🚀 Demo en Vivo

[Ver Demo](https://malex1718.github.io/projects/react-dashboard)

## ✨ Características

- 📊 **Visualización de Datos**: Gráficas interactivas con Recharts
- 🎨 **Diseño Responsive**: Tailwind CSS con dark mode
- 🔄 **Estado Global**: Context API para gestión de estado
- 🧩 **Componentes Reutilizables**: Sistema de componentes modulares
- 📱 **PWA Ready**: Instalable como aplicación
- 🚀 **Optimizado**: Code splitting y lazy loading
- 🔐 **Autenticación Mock**: Sistema de login simulado
- 📈 **Datos en Tiempo Real**: WebSocket simulation

## 🛠️ Stack Tecnológico

- **React 18.2** - UI Library
- **TypeScript 5.0** - Type Safety
- **Tailwind CSS 3.3** - Styling
- **Recharts** - Gráficas
- **React Router 6** - Navegación
- **Vite** - Build Tool
- **React Query** - Data Fetching
- **Zustand** - State Management (alternativa a Context)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview

# Tests
npm run test

# Linting
npm run lint
```

## 📁 Estructura del Proyecto

```
react-dashboard/
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── common/       # Componentes genéricos
│   │   ├── charts/       # Componentes de gráficas
│   │   ├── layout/       # Layout components
│   │   └── widgets/      # Widgets del dashboard
│   ├── pages/           # Páginas/Vistas
│   ├── hooks/           # Custom hooks
│   ├── context/         # Context providers
│   ├── services/        # API services
│   ├── types/           # TypeScript types
│   ├── utils/           # Utilidades
│   └── styles/          # Estilos globales
├── public/              # Assets estáticos
└── tests/              # Tests
```

## 🎯 Componentes Principales

### 1. **Layout System**
- Sidebar responsive
- Header con notificaciones
- Footer informativo

### 2. **Charts Components**
- LineChart (Ventas)
- BarChart (Productos)
- PieChart (Categorías)
- AreaChart (Tendencias)

### 3. **Data Tables**
- Tabla con sorting
- Filtrado y búsqueda
- Paginación
- Export CSV

### 4. **Form Components**
- Input validado
- Select múltiple
- Date picker
- File upload

### 5. **Dashboard Widgets**
- KPI Cards
- Activity Feed
- Quick Stats
- User Profile

## 🔧 Configuración

### Variables de Entorno

```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_WS_URL=ws://localhost:8080/ws
VITE_APP_NAME=React Dashboard Demo
```

## 🧪 Testing

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📊 Métricas de Performance

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Bundle Size**: < 200KB gzipped

## 🚀 Deployment

El proyecto se despliega automáticamente en GitHub Pages usando GitHub Actions.

## 📝 Licencia

MIT License