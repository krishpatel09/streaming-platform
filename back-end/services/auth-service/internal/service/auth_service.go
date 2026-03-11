package service

import (
	"errors"
	"fmt"
	"math/rand"
	"time"

	"github.com/google/uuid"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/domain"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/repository"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/utils"
	email "github.com/krishpatel09/streaming-platform/services/auth-service/internal/utils/emails"
)

type AuthService interface {
	Register(req domain.RegisterRequest) (*domain.AuthResponse, error)
	Login(req domain.LoginRequest) (*domain.AuthResponse, error)
	GetProfile(userID uuid.UUID) (*domain.UserResponse, error)
}

type authService struct {
	repo      repository.UserRepository
	redisRepo repository.RedisRepository
	emailUtil *email.EmailSender
	secretKey string
}

func NewAuthService(
	repo repository.UserRepository,
	redisRepo repository.RedisRepository,
	emailUtil *email.EmailSender,
	secretKey string,
) AuthService {
	return &authService{
		repo:      repo,
		redisRepo: redisRepo,
		emailUtil: emailUtil,
		secretKey: secretKey,
	}
}

func (s *authService) Register(req domain.RegisterRequest) (*domain.AuthResponse, error) {
	_, err := s.repo.FindByEmail(req.Email)
	if err == nil {
		return nil, errors.New("user already exists")
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		ID:       uuid.New(),
		Username: req.Username,
		Email:    req.Email,
		Password: hashedPassword,
	}

	if err := s.repo.Create(user); err != nil {
		return nil, err
	}

	otp := fmt.Sprintf("%06d", rand.Intn(1000000))

	if err := s.redisRepo.SetOTP(user.Email, otp, 10*time.Minute); err != nil {
		return nil, errors.New("failed to generate verification code")
	}
	go func() {
		_ = s.emailUtil.SendOTP(user.Email, otp)
	}()

	return &domain.AuthResponse{
		User: domain.UserResponse{
			ID:         user.ID,
			Username:   user.Username,
			Email:      user.Email,
			IsVerified: user.IsVerified,
		},
		Token: "",
	}, nil
}

func (s *authService) Login(req domain.LoginRequest) (*domain.AuthResponse, error) {
	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	if !utils.VerifyPassword(req.Password, user.Password) {
		return nil, errors.New("invalid credentials")
	}

	token, err := utils.GenerateJWT(user.ID, s.secretKey)
	if err != nil {
		return nil, err
	}

	return &domain.AuthResponse{
		User: domain.UserResponse{
			ID:         user.ID,
			Username:   user.Username,
			Email:      user.Email,
			IsVerified: user.IsVerified,
		},
		Token: token,
	}, nil
}

func (s *authService) GetProfile(userID uuid.UUID) (*domain.UserResponse, error) {
	user, err := s.repo.FindByID(userID)
	if err != nil {
		return nil, err
	}

	return &domain.UserResponse{
		ID:         user.ID,
		Username:   user.Username,
		Email:      user.Email,
		IsVerified: user.IsVerified,
	}, nil
}
