# Go API Demo - Task Management System

API REST completa desarrollada con Go y el framework Fiber, demostrando mejores prácticas de arquitectura y desarrollo.

## 🚀 Características

- ✅ CRUD completo para gestión de tareas
- ✅ Autenticación JWT
- ✅ Rate limiting
- ✅ Validación de datos
- ✅ Documentación Swagger
- ✅ Tests unitarios
- ✅ Docker y Docker Compose
- ✅ PostgreSQL con migraciones
- ✅ Logging estructurado
- ✅ CORS configurado

## 📋 Requisitos

- Go 1.21+
- PostgreSQL 14+
- Docker (opcional)

## 🛠️ Instalación

### Opción 1: Con Docker

```bash
docker-compose up -d
```

### Opción 2: Local

1. Instalar dependencias:
```bash
go mod download
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

3. Ejecutar migraciones:
```bash
go run cmd/migrate/main.go up
```

4. Iniciar servidor:
```bash
go run cmd/api/main.go
```

## 📚 Endpoints

### Autenticación
- `POST /api/v1/auth/register` - Registro de usuario
- `POST /api/v1/auth/login` - Inicio de sesión

### Tareas
- `GET /api/v1/tasks` - Listar tareas
- `POST /api/v1/tasks` - Crear tarea
- `GET /api/v1/tasks/:id` - Obtener tarea
- `PUT /api/v1/tasks/:id` - Actualizar tarea
- `DELETE /api/v1/tasks/:id` - Eliminar tarea

## 🧪 Tests

```bash
go test ./... -v
```

## 📊 Documentación API

Swagger UI disponible en: `http://localhost:8080/swagger`

## 🏗️ Estructura del Proyecto

```
go-api-demo/
├── cmd/
│   ├── api/main.go        # Entry point
│   └── migrate/main.go    # Migraciones
├── internal/
│   ├── config/           # Configuración
│   ├── handlers/         # HTTP handlers
│   ├── middleware/       # Middlewares
│   ├── models/          # Modelos de datos
│   ├── repository/      # Capa de datos
│   └── services/        # Lógica de negocio
├── pkg/
│   ├── auth/           # JWT utilities
│   └── validator/      # Validaciones
├── docker-compose.yml
├── Dockerfile
└── go.mod
```