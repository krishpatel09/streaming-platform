package repository

import (
	"time"

	"github.com/google/uuid"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/domain"
	"gorm.io/gorm"
)

type RefreshTokenRepository interface {
	Create(token *domain.RefreshToken) error
	FindByHash(hash string) (*domain.RefreshToken, error)
	UpdateActivity(id uuid.UUID) error
	RevokeByHash(hash string) error
	DeleteByUserID(userID uuid.UUID) error
}

type refreshTokenRepository struct {
	db *gorm.DB
}

func NewRefreshTokenRepository(db *gorm.DB) RefreshTokenRepository {
	return &refreshTokenRepository{db: db}
}

func (r *refreshTokenRepository) Create(token *domain.RefreshToken) error {
	return r.db.Create(token).Error
}

func (r *refreshTokenRepository) FindByHash(hash string) (*domain.RefreshToken, error) {
	var rt domain.RefreshToken
	err := r.db.Preload("Device").Preload("User").
		Where("token_hash = ? AND revoked_at IS NULL", hash).
		First(&rt).Error
	if err != nil {
		return nil, err
	}
	return &rt, nil
}

func (r *refreshTokenRepository) UpdateActivity(id uuid.UUID) error {
	return r.db.Model(&domain.RefreshToken{}).Where("id = ?", id).
		Update("last_activity_at", time.Now()).Error
}

func (r *refreshTokenRepository) RevokeByHash(hash string) error {
	return r.db.Model(&domain.RefreshToken{}).Where("token_hash = ?", hash).
		Update("revoked_at", time.Now()).Error
}

func (r *refreshTokenRepository) DeleteByUserID(userID uuid.UUID) error {
	return r.db.Where("user_id = ?", userID).Delete(&domain.RefreshToken{}).Error
}
