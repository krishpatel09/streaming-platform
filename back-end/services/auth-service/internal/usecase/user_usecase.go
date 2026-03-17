package usecase

import (
	"github.com/google/uuid"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/domain"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/repository"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/utils/response"
)

type UserUseCase interface {
	GetProfile(userID uuid.UUID) (*domain.UserResponse, error)
}

type userUseCase struct {
	userRepo repository.UserRepository
}

func NewUserUseCase(userRepo repository.UserRepository) UserUseCase {
	return &userUseCase{
		userRepo: userRepo,
	}
}

func (u *userUseCase) GetProfile(userID uuid.UUID) (*domain.UserResponse, error) {
	user, err := u.userRepo.FindByID(userID)
	if err != nil {
		return nil, response.BadRequest("user not found")
	}

	return &domain.UserResponse{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
	}, nil
}
