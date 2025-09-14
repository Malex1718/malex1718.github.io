package repository

import (
	"database/sql"
	"errors"
	"time"

	"github.com/malex1718/go-api-demo/internal/models"
)

type TaskRepository struct {
	db *sql.DB
}

func NewTaskRepository(db *sql.DB) *TaskRepository {
	return &TaskRepository{db: db}
}

func (r *TaskRepository) Create(task *models.Task) error {
	query := `
		INSERT INTO tasks (title, description, status, user_id, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id`
	
	now := time.Now()
	err := r.db.QueryRow(
		query,
		task.Title,
		task.Description,
		task.Status,
		task.UserID,
		now,
		now,
	).Scan(&task.ID)
	
	if err != nil {
		return err
	}
	
	task.CreatedAt = now
	task.UpdatedAt = now
	return nil
}

func (r *TaskRepository) GetByID(id int) (*models.Task, error) {
	query := `
		SELECT id, title, description, status, user_id, created_at, updated_at
		FROM tasks
		WHERE id = $1`
	
	task := &models.Task{}
	err := r.db.QueryRow(query, id).Scan(
		&task.ID,
		&task.Title,
		&task.Description,
		&task.Status,
		&task.UserID,
		&task.CreatedAt,
		&task.UpdatedAt,
	)
	
	if err == sql.ErrNoRows {
		return nil, errors.New("task not found")
	}
	
	return task, err
}

func (r *TaskRepository) GetByUserID(userID int) ([]*models.Task, error) {
	query := `
		SELECT id, title, description, status, user_id, created_at, updated_at
		FROM tasks
		WHERE user_id = $1
		ORDER BY created_at DESC`
	
	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var tasks []*models.Task
	for rows.Next() {
		task := &models.Task{}
		err := rows.Scan(
			&task.ID,
			&task.Title,
			&task.Description,
			&task.Status,
			&task.UserID,
			&task.CreatedAt,
			&task.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}
	
	if err = rows.Err(); err != nil {
		return nil, err
	}
	
	return tasks, nil
}

func (r *TaskRepository) GetByStatus(userID int, status string) ([]*models.Task, error) {
	query := `
		SELECT id, title, description, status, user_id, created_at, updated_at
		FROM tasks
		WHERE user_id = $1 AND status = $2
		ORDER BY created_at DESC`
	
	rows, err := r.db.Query(query, userID, status)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var tasks []*models.Task
	for rows.Next() {
		task := &models.Task{}
		err := rows.Scan(
			&task.ID,
			&task.Title,
			&task.Description,
			&task.Status,
			&task.UserID,
			&task.CreatedAt,
			&task.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}
	
	if err = rows.Err(); err != nil {
		return nil, err
	}
	
	return tasks, nil
}

func (r *TaskRepository) Update(task *models.Task) error {
	query := `
		UPDATE tasks
		SET title = $1, description = $2, status = $3, updated_at = $4
		WHERE id = $5 AND user_id = $6`
	
	task.UpdatedAt = time.Now()
	result, err := r.db.Exec(
		query,
		task.Title,
		task.Description,
		task.Status,
		task.UpdatedAt,
		task.ID,
		task.UserID,
	)
	
	if err != nil {
		return err
	}
	
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	
	if rowsAffected == 0 {
		return errors.New("task not found or unauthorized")
	}
	
	return nil
}

func (r *TaskRepository) Delete(id, userID int) error {
	query := `DELETE FROM tasks WHERE id = $1 AND user_id = $2`
	
	result, err := r.db.Exec(query, id, userID)
	if err != nil {
		return err
	}
	
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	
	if rowsAffected == 0 {
		return errors.New("task not found or unauthorized")
	}
	
	return nil
}

func (r *TaskRepository) CountByStatus(userID int) (map[string]int, error) {
	query := `
		SELECT status, COUNT(*) as count
		FROM tasks
		WHERE user_id = $1
		GROUP BY status`
	
	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	statusCounts := make(map[string]int)
	for rows.Next() {
		var status string
		var count int
		err := rows.Scan(&status, &count)
		if err != nil {
			return nil, err
		}
		statusCounts[status] = count
	}
	
	if err = rows.Err(); err != nil {
		return nil, err
	}
	
	// Ensure all statuses are present
	for _, status := range []string{"pending", "in_progress", "completed"} {
		if _, exists := statusCounts[status]; !exists {
			statusCounts[status] = 0
		}
	}
	
	return statusCounts, nil
}

func (r *TaskRepository) BelongsToUser(taskID, userID int) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM tasks WHERE id = $1 AND user_id = $2)`
	
	var exists bool
	err := r.db.QueryRow(query, taskID, userID).Scan(&exists)
	return exists, err
}