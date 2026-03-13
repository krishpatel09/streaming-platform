package repository

import (
	"github.com/google/uuid"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/domain"
	"gorm.io/gorm"
)

type PreferenceRepository interface {
	GetByProfileID(profileID uuid.UUID) (*domain.UserPreferences, error)
	Create(pref *domain.UserPreferences) error
	Update(pref *domain.UserPreferences) error
}

type preferenceRepository struct {
	db *gorm.DB
}

func NewPreferenceRepository(db *gorm.DB) PreferenceRepository {
	return &preferenceRepository{db: db}
}

func (r *preferenceRepository) GetByProfileID(profileID uuid.UUID) (*domain.UserPreferences, error) {
	var pref domain.UserPreferences
	err := r.db.Where("profile_id = ?", profileID).First(&pref).Error
	if err != nil {
		return nil, err
	}
	return &pref, nil
}

func (r *preferenceRepository) Create(pref *domain.UserPreferences) error {
	return r.db.Create(pref).Error
}

func (r *preferenceRepository) Update(pref *domain.UserPreferences) error {
	return r.db.Save(pref).Error
}
