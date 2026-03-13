package usecase

import (
	"github.com/google/uuid"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/domain"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/repository"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/utils/response"
)

type UserUseCase interface {
	GetProfile(userID uuid.UUID) (*domain.UserResponse, error)
	GetPreference(profileID uuid.UUID) (*domain.UserPreferenceResponse, error)
	UpdatePreference(profileID uuid.UUID, req domain.UserPreferenceRequest) (*domain.UserPreferenceResponse, error)
}

type userUseCase struct {
	userRepo       repository.UserRepository
	preferenceRepo repository.PreferenceRepository
}

func NewUserUseCase(userRepo repository.UserRepository, preferenceRepo repository.PreferenceRepository) UserUseCase {
	return &userUseCase{
		userRepo:       userRepo,
		preferenceRepo: preferenceRepo,
	}
}

func (u *userUseCase) GetProfile(userID uuid.UUID) (*domain.UserResponse, error) {
	user, err := u.userRepo.FindByID(userID)
	if err != nil {
		return nil, response.BadRequest("user not found")
	}

	return &domain.UserResponse{
		ID:         user.ID,
		Username:   user.Username,
		Email:      user.Email,
		IsVerified: user.IsVerified,
	}, nil
}

func (u *userUseCase) GetPreference(profileID uuid.UUID) (*domain.UserPreferenceResponse, error) {
	pref, err := u.preferenceRepo.GetByProfileID(profileID)
	if err != nil {
		return nil, response.BadRequest("preferences not found")
	}

	return &domain.UserPreferenceResponse{
		PreferredGenres:     pref.PreferredGenres,
		PreferredLanguages:  pref.PreferredLanguages,
		AutoplayNext:        pref.AutoplayNext,
		DefaultVideoQuality: pref.DefaultVideoQuality,
		EmailNotifications:  pref.EmailNotifications,
		PushNotifications:   pref.PushNotifications,
	}, nil
}

func (u *userUseCase) UpdatePreference(profileID uuid.UUID, req domain.UserPreferenceRequest) (*domain.UserPreferenceResponse, error) {
	pref, err := u.preferenceRepo.GetByProfileID(profileID)
	if err != nil {
		// If not exists, create new one
		pref = &domain.UserPreferences{
			ProfileID: profileID,
		}
	}

	if req.PreferredGenres != nil {
		pref.PreferredGenres = req.PreferredGenres
	}
	if req.PreferredLanguages != nil {
		pref.PreferredLanguages = req.PreferredLanguages
	}
	if req.AutoplayNext != nil {
		pref.AutoplayNext = *req.AutoplayNext
	}
	if req.DefaultVideoQuality != "" {
		pref.DefaultVideoQuality = req.DefaultVideoQuality
	}
	if req.EmailNotifications != nil {
		pref.EmailNotifications = *req.EmailNotifications
	}
	if req.PushNotifications != nil {
		pref.PushNotifications = *req.PushNotifications
	}

	if pref.ID == uuid.Nil {
		err = u.preferenceRepo.Create(pref)
	} else {
		err = u.preferenceRepo.Update(pref)
	}

	if err != nil {
		return nil, response.GeneralError(err)
	}

	return &domain.UserPreferenceResponse{
		PreferredGenres:     pref.PreferredGenres,
		PreferredLanguages:  pref.PreferredLanguages,
		AutoplayNext:        pref.AutoplayNext,
		DefaultVideoQuality: pref.DefaultVideoQuality,
		EmailNotifications:  pref.EmailNotifications,
		PushNotifications:   pref.PushNotifications,
	}, nil
}
