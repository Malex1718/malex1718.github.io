package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
	"github.com/malex1718/go-api-demo/internal/config"
	"github.com/malex1718/go-api-demo/internal/handlers"
	"github.com/malex1718/go-api-demo/internal/middleware"
	"github.com/malex1718/go-api-demo/internal/repository"
	"github.com/malex1718/go-api-demo/internal/services"
)

func main() {
	// Cargar variables de entorno
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Configuración
	cfg := config.Load()

	// Conectar a la base de datos
	db, err := config.ConnectDB(cfg)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Inicializar repositorios
	userRepo := repository.NewUserRepository(db)
	taskRepo := repository.NewTaskRepository(db)

	// Inicializar servicios
	authService := services.NewAuthService(userRepo, cfg.JWTSecret)
	taskService := services.NewTaskService(taskRepo)

	// Inicializar handlers
	authHandler := handlers.NewAuthHandler(authService)
	taskHandler := handlers.NewTaskHandler(taskService)

	// Configurar Fiber
	app := fiber.New(fiber.Config{
		ErrorHandler: middleware.ErrorHandler,
	})

	// Middlewares globales
	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, HEAD, PUT, PATCH, POST, DELETE",
	}))

	// Rate limiting
	app.Use(middleware.RateLimiter())

	// Rutas
	api := app.Group("/api/v1")

	// Rutas de autenticación
	auth := api.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)

	// Rutas protegidas
	tasks := api.Group("/tasks")
	tasks.Use(middleware.AuthMiddleware(cfg.JWTSecret))
	tasks.Get("/", taskHandler.GetTasks)
	tasks.Post("/", taskHandler.CreateTask)
	tasks.Get("/:id", taskHandler.GetTask)
	tasks.Put("/:id", taskHandler.UpdateTask)
	tasks.Delete("/:id", taskHandler.DeleteTask)

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "ok",
			"service": "go-api-demo",
		})
	})

	// Iniciar servidor
	log.Printf("Server starting on port %s", cfg.Port)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}