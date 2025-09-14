package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/malex1718/go-api-demo/internal/services"
)

type AuthHandler struct {
	authService *services.AuthService
	validator   *validator.Validate
}

func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		validator:   validator.New(),
	}
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var input services.RegisterInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		h.respondError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate input
	if err := h.validator.Struct(input); err != nil {
		h.respondError(w, h.formatValidationError(err), http.StatusBadRequest)
		return
	}

	// Register user
	authResponse, err := h.authService.Register(input)
	if err != nil {
		statusCode := http.StatusInternalServerError
		if err.Error() == "username already taken" || err.Error() == "email already registered" {
			statusCode = http.StatusConflict
		}
		h.respondError(w, err.Error(), statusCode)
		return
	}

	h.respondJSON(w, authResponse, http.StatusCreated)
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var input services.LoginInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		h.respondError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate input
	if err := h.validator.Struct(input); err != nil {
		h.respondError(w, h.formatValidationError(err), http.StatusBadRequest)
		return
	}

	// Login user
	authResponse, err := h.authService.Login(input)
	if err != nil {
		statusCode := http.StatusInternalServerError
		if err.Error() == "invalid credentials" {
			statusCode = http.StatusUnauthorized
		}
		h.respondError(w, err.Error(), statusCode)
		return
	}

	h.respondJSON(w, authResponse, http.StatusOK)
}

func (h *AuthHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	// Get user ID from context (set by auth middleware)
	userID, ok := r.Context().Value("userID").(int)
	if !ok {
		h.respondError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	user, err := h.authService.GetUserByID(userID)
	if err != nil {
		h.respondError(w, "User not found", http.StatusNotFound)
		return
	}

	h.respondJSON(w, user, http.StatusOK)
}

func (h *AuthHandler) respondJSON(w http.ResponseWriter, data interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}

func (h *AuthHandler) respondError(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(map[string]string{
		"error": message,
	})
}

func (h *AuthHandler) formatValidationError(err error) string {
	if validationErrors, ok := err.(validator.ValidationErrors); ok {
		for _, e := range validationErrors {
			switch e.Tag() {
			case "required":
				return e.Field() + " is required"
			case "email":
				return "Invalid email format"
			case "min":
				if e.Field() == "Password" {
					return "Password must be at least 8 characters"
				}
				return e.Field() + " is too short"
			case "max":
				return e.Field() + " is too long"
			}
		}
	}
	return "Validation error"
}