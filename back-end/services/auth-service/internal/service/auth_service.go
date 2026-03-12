package service

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/google/uuid"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/domain"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/repository"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/utils"
	email "github.com/krishpatel09/streaming-platform/services/auth-service/internal/utils/emails"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/utils/response"
)

type AuthService interface {
	Register(req domain.RegisterRequest) (*domain.AuthResponse, error)
	Login(req domain.LoginRequest) (*domain.AuthResponse, error)
	VerifyOTP(req domain.VerifyOTPRequest) (*domain.AuthResponse, error)
	ResendOTP(req domain.ResendOTPRequest) (*domain.AuthResponse, error)
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
		return nil, response.EmailAlreadyExists()
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

	if err := s.redisRepo.SetOTP(user.Email, otp, 5*time.Minute); err != nil {
		return nil, response.GeneralError(err)
	}

	go func() {
		if err := s.emailUtil.SendOTP(user.Email, otp); err != nil {
			fmt.Printf("Email sending failed for %s: %v\n", user.Email, err)
		}
	}()

	return &domain.AuthResponse{
		User: domain.UserResponse{
			ID:       user.ID,
			Username: user.Username,
			Email:    user.Email,
		},
		Message: "register successfully verify otp",
	}, nil
}

func (s *authService) VerifyOTP(req domain.VerifyOTPRequest) (*domain.AuthResponse, error) {
	storedOTP, err := s.redisRepo.GetOTP(req.Email)
	if err != nil {
		return nil, response.BadRequest("otp expired or invalid")
	}

	if storedOTP != req.OTP {
		return nil, response.BadRequest("invalid otp")
	}

	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return nil, response.BadRequest("user not found")
	}

	if err := s.repo.UpdateVerificationStatus(user.Email, true); err != nil {
		return nil, response.GeneralError(err)
	}

	if err := s.redisRepo.DeleteOTP(req.Email); err != nil {
		fmt.Printf("failed to delete otp: %v\n", err)
	}

	accessToken, refreshToken, err := utils.GenerateTokens(user.ID, s.secretKey)
	if err != nil {
		return nil, err
	}

	return &domain.AuthResponse{
		User: domain.UserResponse{
			ID:         user.ID,
			Username:   user.Username,
			Email:      user.Email,
			IsVerified: true,
		},
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		Message:      "email verified successfully",
	}, nil
}

func (s *authService) ResendOTP(req domain.ResendOTPRequest) (*domain.AuthResponse, error) {
	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return nil, response.BadRequest("user not found")
	}

	if user.IsVerified {
		return nil, response.BadRequest("email already verified")
	}

	otp := fmt.Sprintf("%06d", rand.Intn(1000000))

	if err := s.redisRepo.SetOTP(user.Email, otp, 5*time.Minute); err != nil {
		return nil, response.GeneralError(err)
	}

	go func() {
		if err := s.emailUtil.SendOTP(user.Email, otp); err != nil {
			fmt.Printf("Email sending failed for %s: %v\n", user.Email, err)
		}
	}()

	return &domain.AuthResponse{
		User: domain.UserResponse{
			ID:         user.ID,
			Username:   user.Username,
			Email:      user.Email,
			IsVerified: user.IsVerified,
		},
		Message: "otp resent successfully",
	}, nil
}

func (s *authService) Login(req domain.LoginRequest) (*domain.AuthResponse, error) {
	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return nil, response.Unauthorized("invalid credentials")
	}

	if !utils.VerifyPassword(req.Password, user.Password) {
		return nil, response.Unauthorized("invalid credentials")
	}

	accessToken, refreshToken, err := utils.GenerateTokens(user.ID, s.secretKey)
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
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

// func (s *authService) Logout(userID uuid.UUID) error {
// }

func (s *authService) GetProfile(userID uuid.UUID) (*domain.UserResponse, error) {
	user, err := s.repo.FindByID(userID)
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
