package usecase

import (
	"github.com/google/uuid"
	"github.com/krishpatel09/streaming-platform/auth-service/internal/domain"
	"github.com/krishpatel09/streaming-platform/auth-service/internal/repository"
	"github.com/krishpatel09/streaming-platform/auth-service/internal/utils/response"
)

type ProfileUseCase interface {
	GetProfiles(userID uuid.UUID) ([]domain.Profile, error)
	CreateProfile(userID uuid.UUID, profile *domain.Profile) error
	UpdateProfile(userID uuid.UUID, profile *domain.Profile) error
	DeleteProfile(userID uuid.UUID, profileID uuid.UUID) error
	GetPreferences(profileID uuid.UUID) (*domain.UserPreference, error)
	UpdatePreferences(profileID uuid.UUID, prefs *domain.UserPreference) error
}

type profileUseCase struct {
	repo repository.ProfileRepository
}

func NewProfileUseCase(repo repository.ProfileRepository) ProfileUseCase {
	return &profileUseCase{repo: repo}
}

func (s *profileUseCase) GetProfiles(userID uuid.UUID) ([]domain.Profile, error) {
	return s.repo.FindByUserID(userID)
}

func (s *profileUseCase) CreateProfile(userID uuid.UUID, profile *domain.Profile) error {
	profile.UserID = userID
	// Default preferences for new profile
	prefs := &domain.UserPreference{
		AutoplayNext:        true,
		DefaultVideoQuality: "auto",
		EmailNotifications:  true,
		PushNotifications:   true,
	}
	return s.repo.CreateWithPreferences(profile, prefs)
}

func (s *profileUseCase) UpdateProfile(userID uuid.UUID, profile *domain.Profile) error {
	existing, err := s.repo.FindByID(profile.ID)
	if err != nil {
		return response.BadRequest("profile not found")
	}
	if existing.UserID != userID {
		return response.Unauthorized("not your profile")
	}
	
	existing.ProfileName = profile.ProfileName
	existing.AvatarURL = profile.AvatarURL
	existing.IsKidsProfile = profile.IsKidsProfile
	
	if profile.PinCodeHash != nil {
		existing.PinCodeHash = profile.PinCodeHash
	}

	return s.repo.Update(existing)
}

func (s *profileUseCase) DeleteProfile(userID uuid.UUID, profileID uuid.UUID) error {
	existing, err := s.repo.FindByID(profileID)
	if err != nil {
		return response.BadRequest("profile not found")
	}
	if existing.UserID != userID {
		return response.Unauthorized("not your profile")
	}
	if existing.IsPrimary {
		return response.BadRequest("cannot delete primary profile")
	}
	return s.repo.Delete(profileID)
}

func (s *profileUseCase) GetPreferences(profileID uuid.UUID) (*domain.UserPreference, error) {
	return s.repo.GetPreferences(profileID)
}

func (s *profileUseCase) UpdatePreferences(profileID uuid.UUID, prefs *domain.UserPreference) error {
	existing, err := s.repo.GetPreferences(profileID)
	if err != nil {
		return response.BadRequest("preferences not found")
	}
	
	existing.PreferredGenres = prefs.PreferredGenres
	existing.PreferredLanguages = prefs.PreferredLanguages
	existing.AutoplayNext = prefs.AutoplayNext
	existing.DefaultVideoQuality = prefs.DefaultVideoQuality
	existing.EmailNotifications = prefs.EmailNotifications
	existing.PushNotifications = prefs.PushNotifications
	
	return s.repo.UpdatePreferences(existing)
}
