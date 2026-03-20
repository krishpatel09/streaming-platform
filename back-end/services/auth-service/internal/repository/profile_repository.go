package repository

import (
	"github.com/google/uuid"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/domain"
	"gorm.io/gorm"
)

type ProfileRepository interface {
	Create(profile *domain.Profile) error
	Update(profile *domain.Profile) error
	Delete(id uuid.UUID) error
	FindByID(id uuid.UUID) (*domain.Profile, error)
	FindByUserID(userID uuid.UUID) ([]domain.Profile, error)
	GetPreferences(profileID uuid.UUID) (*domain.UserPreference, error)
	UpdatePreferences(prefs *domain.UserPreference) error
	CreateWithPreferences(profile *domain.Profile, prefs *domain.UserPreference) error
}

type profileRepository struct {
	db *gorm.DB
}

func NewProfileRepository(db *gorm.DB) ProfileRepository {
	return &profileRepository{db: db}
}

func (r *profileRepository) Create(profile *domain.Profile) error {
	return r.db.Create(profile).Error
}

func (r *profileRepository) CreateWithPreferences(profile *domain.Profile, prefs *domain.UserPreference) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(profile).Error; err != nil {
			return err
		}
		prefs.ProfileID = profile.ID
		return tx.Create(prefs).Error
	})
}

func (r *profileRepository) Update(profile *domain.Profile) error {
	return r.db.Save(profile).Error
}

func (r *profileRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&domain.Profile{}, id).Error
}

func (r *profileRepository) FindByID(id uuid.UUID) (*domain.Profile, error) {
	var profile domain.Profile
	err := r.db.Preload("Preferences").First(&profile, id).Error
	if err != nil {
		return nil, err
	}
	return &profile, nil
}

func (r *profileRepository) FindByUserID(userID uuid.UUID) ([]domain.Profile, error) {
	var profiles []domain.Profile
	err := r.db.Preload("Preferences").Where("user_id = ?", userID).Find(&profiles).Error
	return profiles, err
}

func (r *profileRepository) GetPreferences(profileID uuid.UUID) (*domain.UserPreference, error) {
	var prefs domain.UserPreference
	err := r.db.Where("profile_id = ?", profileID).First(&prefs).Error
	if err != nil {
		return nil, err
	}
	return &prefs, nil
}

func (r *profileRepository) UpdatePreferences(prefs *domain.UserPreference) error {
	return r.db.Save(prefs).Error
}
