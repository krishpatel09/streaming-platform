package repository

import (
	"time"

	"github.com/google/uuid"
	"github.com/krishpatel09/streaming-platform/auth-service/internal/domain"
	"gorm.io/gorm"
)

type OTPRepository interface {
	Create(otp *domain.OTPVerification) error
	GetLatest(identifier string, purpose string) (*domain.OTPVerification, error)
	IncrementAttempts(id uuid.UUID) error
	CountLast10Mins(identifier string) (int64, error)
	Delete(id uuid.UUID) error
}

type otpRepository struct {
	db *gorm.DB
}

func NewOTPRepository(db *gorm.DB) OTPRepository {
	return &otpRepository{db: db}
}

func (r *otpRepository) Create(otp *domain.OTPVerification) error {
	return r.db.Create(otp).Error
}

func (r *otpRepository) GetLatest(identifier string, purpose string) (*domain.OTPVerification, error) {
	var otp domain.OTPVerification
	err := r.db.Where("identifier = ? AND purpose = ? AND expires_at > ?", identifier, purpose, time.Now()).
		Order("created_at DESC").
		First(&otp).Error
	if err != nil {
		return nil, err
	}
	return &otp, nil
}

func (r *otpRepository) IncrementAttempts(id uuid.UUID) error {
	return r.db.Model(&domain.OTPVerification{}).Where("id = ?", id).
		Update("attempts", gorm.Expr("attempts + 1")).Error
}

func (r *otpRepository) CountLast10Mins(identifier string) (int64, error) {
	var count int64
	err := r.db.Model(&domain.OTPVerification{}).
		Where("identifier = ? AND created_at > ?", identifier, time.Now().Add(-10*time.Minute)).
		Count(&count).Error
	return count, err
}

func (r *otpRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&domain.OTPVerification{}, id).Error
}
