package repository

import (
	"time"

	"github.com/google/uuid"
	"github.com/krishpatel09/streaming-platform/auth-service/internal/domain"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type SessionRepository interface {
	LogActivity(activity *domain.SessionActivity) error
	CreateOTPBypass(bypass *domain.OTPBypass) error
	CheckOTPBypass(userID, deviceID uuid.UUID) (*domain.OTPBypass, error)
	RevokeOTPBypass(userID, deviceID uuid.UUID) error
	RevokeOldestSession(userID uuid.UUID, limit int) error
	GetActiveSessions(userID uuid.UUID) ([]domain.RefreshToken, error)
	RevokeSession(sessionID uuid.UUID) error
}

type sessionRepository struct {
	db *gorm.DB
}

func NewSessionRepository(db *gorm.DB) SessionRepository {
	return &sessionRepository{db: db}
}

func (r *sessionRepository) LogActivity(activity *domain.SessionActivity) error {
	return r.db.Create(activity).Error
}

func (r *sessionRepository) CreateOTPBypass(bypass *domain.OTPBypass) error {
	return r.db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "user_id"}, {Name: "device_id"}},
		DoUpdates: clause.AssignmentColumns([]string{"valid_until", "revoked_at"}),
	}).Create(bypass).Error
}

func (r *sessionRepository) CheckOTPBypass(userID, deviceID uuid.UUID) (*domain.OTPBypass, error) {
	var bypass domain.OTPBypass
	err := r.db.Where("user_id = ? AND device_id = ? AND valid_until > ? AND revoked_at IS NULL",
		userID, deviceID, time.Now()).First(&bypass).Error
	if err != nil {
		return nil, err
	}
	return &bypass, nil
}

func (r *sessionRepository) RevokeOTPBypass(userID, deviceID uuid.UUID) error {
	return r.db.Model(&domain.OTPBypass{}).
		Where("user_id = ? AND device_id = ?", userID, deviceID).
		Update("revoked_at", time.Now()).Error
}

func (r *sessionRepository) RevokeOldestSession(userID uuid.UUID, limit int) error {
	var count int64
	r.db.Model(&domain.RefreshToken{}).Where("user_id = ? AND revoked_at IS NULL", userID).Count(&count)

	if count >= int64(limit) {
		return r.db.Exec(`
			UPDATE refresh_tokens
			SET revoked_at = NOW()
			WHERE id = (
				SELECT id FROM refresh_tokens
				WHERE user_id = ? AND revoked_at IS NULL
				ORDER BY last_activity_at ASC
				LIMIT 1
			)
		`, userID).Error
	}
	return nil
}

func (r *sessionRepository) GetActiveSessions(userID uuid.UUID) ([]domain.RefreshToken, error) {
	var sessions []domain.RefreshToken
	err := r.db.Preload("Device").
		Where("user_id = ? AND revoked_at IS NULL", userID).
		Order("last_activity_at DESC").Find(&sessions).Error
	return sessions, err
}

func (r *sessionRepository) RevokeSession(sessionID uuid.UUID) error {
	return r.db.Model(&domain.RefreshToken{}).Where("id = ?", sessionID).
		Update("revoked_at", time.Now()).Error
}
