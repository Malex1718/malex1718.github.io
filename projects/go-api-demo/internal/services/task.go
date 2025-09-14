package services

import (
	"errors"
	"time"

	"github.com/malex1718/go-api-demo/internal/models"
	"github.com/malex1718/go-api-demo/internal/repository"
)

type TaskService struct {
	taskRepo *repository.TaskRepository
}

func NewTaskService(taskRepo *repository.TaskRepository) *TaskService {
	return &TaskService{
		taskRepo: taskRepo,
	}
}

type CreateTaskInput struct {
	Title       string `json:"title" validate:"required,min=1,max=200"`
	Description string `json:"description" validate:"max=1000"`
	Status      string `json:"status" validate:"omitempty,oneof=pending in_progress completed"`
}

type UpdateTaskInput struct {
	Title       string `json:"title" validate:"required,min=1,max=200"`
	Description string `json:"description" validate:"max=1000"`
	Status      string `json:"status" validate:"required,oneof=pending in_progress completed"`
}

type TaskResponse struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	UserID      int       `json:"user_id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type TaskStatistics struct {
	Total      int            `json:"total"`
	ByStatus   map[string]int `json:"by_status"`
	LastUpdate time.Time      `json:"last_update"`
}

func (s *TaskService) CreateTask(userID int, input CreateTaskInput) (*TaskResponse, error) {
	// Default status if not provided
	if input.Status == "" {
		input.Status = "pending"
	}

	task := &models.Task{
		Title:       input.Title,
		Description: input.Description,
		Status:      input.Status,
		UserID:      userID,
	}

	err := s.taskRepo.Create(task)
	if err != nil {
		return nil, err
	}

	return s.taskToResponse(task), nil
}

func (s *TaskService) GetTaskByID(taskID, userID int) (*TaskResponse, error) {
	// Check if task belongs to user
	belongs, err := s.taskRepo.BelongsToUser(taskID, userID)
	if err != nil {
		return nil, err
	}
	if !belongs {
		return nil, errors.New("task not found or unauthorized")
	}

	task, err := s.taskRepo.GetByID(taskID)
	if err != nil {
		return nil, err
	}

	return s.taskToResponse(task), nil
}

func (s *TaskService) GetUserTasks(userID int, status string) ([]*TaskResponse, error) {
	var tasks []*models.Task
	var err error

	if status != "" {
		// Validate status
		validStatuses := map[string]bool{
			"pending":     true,
			"in_progress": true,
			"completed":   true,
		}
		if !validStatuses[status] {
			return nil, errors.New("invalid status filter")
		}
		tasks, err = s.taskRepo.GetByStatus(userID, status)
	} else {
		tasks, err = s.taskRepo.GetByUserID(userID)
	}

	if err != nil {
		return nil, err
	}

	responses := make([]*TaskResponse, len(tasks))
	for i, task := range tasks {
		responses[i] = s.taskToResponse(task)
	}

	return responses, nil
}

func (s *TaskService) UpdateTask(taskID, userID int, input UpdateTaskInput) (*TaskResponse, error) {
	// Check if task belongs to user
	belongs, err := s.taskRepo.BelongsToUser(taskID, userID)
	if err != nil {
		return nil, err
	}
	if !belongs {
		return nil, errors.New("task not found or unauthorized")
	}

	task := &models.Task{
		ID:          taskID,
		Title:       input.Title,
		Description: input.Description,
		Status:      input.Status,
		UserID:      userID,
	}

	err = s.taskRepo.Update(task)
	if err != nil {
		return nil, err
	}

	// Get updated task
	updated, err := s.taskRepo.GetByID(taskID)
	if err != nil {
		return nil, err
	}

	return s.taskToResponse(updated), nil
}

func (s *TaskService) DeleteTask(taskID, userID int) error {
	return s.taskRepo.Delete(taskID, userID)
}

func (s *TaskService) GetUserStatistics(userID int) (*TaskStatistics, error) {
	statusCounts, err := s.taskRepo.CountByStatus(userID)
	if err != nil {
		return nil, err
	}

	total := 0
	for _, count := range statusCounts {
		total += count
	}

	// Get most recent task to determine last update
	tasks, err := s.taskRepo.GetByUserID(userID)
	var lastUpdate time.Time
	if err == nil && len(tasks) > 0 {
		lastUpdate = tasks[0].UpdatedAt
	}

	return &TaskStatistics{
		Total:      total,
		ByStatus:   statusCounts,
		LastUpdate: lastUpdate,
	}, nil
}

func (s *TaskService) taskToResponse(task *models.Task) *TaskResponse {
	return &TaskResponse{
		ID:          task.ID,
		Title:       task.Title,
		Description: task.Description,
		Status:      task.Status,
		UserID:      task.UserID,
		CreatedAt:   task.CreatedAt,
		UpdatedAt:   task.UpdatedAt,
	}
}