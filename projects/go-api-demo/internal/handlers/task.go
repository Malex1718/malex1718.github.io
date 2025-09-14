package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"github.com/malex1718/go-api-demo/internal/services"
)

type TaskHandler struct {
	taskService *services.TaskService
	validator   *validator.Validate
}

func NewTaskHandler(taskService *services.TaskService) *TaskHandler {
	return &TaskHandler{
		taskService: taskService,
		validator:   validator.New(),
	}
}

func (h *TaskHandler) CreateTask(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("userID").(int)
	if !ok {
		h.respondError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var input services.CreateTaskInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		h.respondError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate input
	if err := h.validator.Struct(input); err != nil {
		h.respondError(w, h.formatValidationError(err), http.StatusBadRequest)
		return
	}

	task, err := h.taskService.CreateTask(userID, input)
	if err != nil {
		h.respondError(w, err.Error(), http.StatusInternalServerError)
		return
	}

	h.respondJSON(w, task, http.StatusCreated)
}

func (h *TaskHandler) GetTask(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("userID").(int)
	if !ok {
		h.respondError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	taskID, err := strconv.Atoi(vars["id"])
	if err != nil {
		h.respondError(w, "Invalid task ID", http.StatusBadRequest)
		return
	}

	task, err := h.taskService.GetTaskByID(taskID, userID)
	if err != nil {
		statusCode := http.StatusInternalServerError
		if err.Error() == "task not found or unauthorized" {
			statusCode = http.StatusNotFound
		}
		h.respondError(w, err.Error(), statusCode)
		return
	}

	h.respondJSON(w, task, http.StatusOK)
}

func (h *TaskHandler) GetTasks(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("userID").(int)
	if !ok {
		h.respondError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Get status filter from query parameters
	status := r.URL.Query().Get("status")

	tasks, err := h.taskService.GetUserTasks(userID, status)
	if err != nil {
		statusCode := http.StatusInternalServerError
		if err.Error() == "invalid status filter" {
			statusCode = http.StatusBadRequest
		}
		h.respondError(w, err.Error(), statusCode)
		return
	}

	h.respondJSON(w, tasks, http.StatusOK)
}

func (h *TaskHandler) UpdateTask(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("userID").(int)
	if !ok {
		h.respondError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	taskID, err := strconv.Atoi(vars["id"])
	if err != nil {
		h.respondError(w, "Invalid task ID", http.StatusBadRequest)
		return
	}

	var input services.UpdateTaskInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		h.respondError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate input
	if err := h.validator.Struct(input); err != nil {
		h.respondError(w, h.formatValidationError(err), http.StatusBadRequest)
		return
	}

	task, err := h.taskService.UpdateTask(taskID, userID, input)
	if err != nil {
		statusCode := http.StatusInternalServerError
		if err.Error() == "task not found or unauthorized" {
			statusCode = http.StatusNotFound
		}
		h.respondError(w, err.Error(), statusCode)
		return
	}

	h.respondJSON(w, task, http.StatusOK)
}

func (h *TaskHandler) DeleteTask(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("userID").(int)
	if !ok {
		h.respondError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	taskID, err := strconv.Atoi(vars["id"])
	if err != nil {
		h.respondError(w, "Invalid task ID", http.StatusBadRequest)
		return
	}

	err = h.taskService.DeleteTask(taskID, userID)
	if err != nil {
		statusCode := http.StatusInternalServerError
		if err.Error() == "task not found or unauthorized" {
			statusCode = http.StatusNotFound
		}
		h.respondError(w, err.Error(), statusCode)
		return
	}

	h.respondJSON(w, map[string]string{
		"message": "Task deleted successfully",
	}, http.StatusOK)
}

func (h *TaskHandler) GetStatistics(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value("userID").(int)
	if !ok {
		h.respondError(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	stats, err := h.taskService.GetUserStatistics(userID)
	if err != nil {
		h.respondError(w, err.Error(), http.StatusInternalServerError)
		return
	}

	h.respondJSON(w, stats, http.StatusOK)
}

func (h *TaskHandler) respondJSON(w http.ResponseWriter, data interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}

func (h *TaskHandler) respondError(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(map[string]string{
		"error": message,
	})
}

func (h *TaskHandler) formatValidationError(err error) string {
	if validationErrors, ok := err.(validator.ValidationErrors); ok {
		for _, e := range validationErrors {
			switch e.Tag() {
			case "required":
				return e.Field() + " is required"
			case "min":
				return e.Field() + " is too short"
			case "max":
				return e.Field() + " is too long"
			case "oneof":
				return e.Field() + " must be one of: pending, in_progress, completed"
			}
		}
	}
	return "Validation error"
}