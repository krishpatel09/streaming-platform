package usecase

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/domain"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/repository"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/utils"
	email "github.com/krishpatel09/streaming-platform/services/auth-service/internal/utils/emails"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/utils/response"
)

type AuthUseCase interface {
	Register(req domain.RegisterRequest) (*domain.AuthResponse, error)
	Login(req domain.LoginRequest) (*domain.AuthResponse, error)
	VerifyOTP(req domain.VerifyOTPRequest) (*domain.AuthResponse, error)
	ResendOTP(req domain.ResendOTPRequest) (*domain.AuthResponse, error)
	RefreshToken(req domain.RefreshTokenRequest) (*domain.AuthResponse, error)
	Logout(token string) error
}

type authUseCase struct {
	repo      repository.UserRepository
	redisRepo repository.RedisRepository
	tokenRepo repository.RefreshTokenRepository
	emailUtil *email.EmailSender
	secretKey string
}

func NewAuthUseCase(
	repo repository.UserRepository,
	redisRepo repository.RedisRepository,
	tokenRepo repository.RefreshTokenRepository,
	emailUtil *email.EmailSender,
	secretKey string,
) AuthUseCase {
	return &authUseCase{
		repo:      repo,
		redisRepo: redisRepo,
		tokenRepo: tokenRepo,
		emailUtil: emailUtil,
		secretKey: secretKey,
	}
}

func (s *authUseCase) Register(req domain.RegisterRequest) (*domain.AuthResponse, error) {
	_, err := s.repo.FindByEmail(req.Email)
	if err == nil {
		return nil, response.EmailAlreadyExists()
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		Username: req.Username,
		Email:    req.Email,
		Password: hashedPassword,
	}

	if err := s.repo.Create(user); err != nil {
		return nil, err
	}

	otp := utils.GenerateOTP()

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

func (s *authUseCase) VerifyOTP(req domain.VerifyOTPRequest) (*domain.AuthResponse, error) {
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

	// Store refresh token
	rfToken := &domain.RefreshToken{
		UserID:    user.ID,
		Token:     refreshToken,
		ExpiresAt: time.Now().Add(time.Hour * 24 * 7),
	}
	if err := s.tokenRepo.Create(rfToken); err != nil {
		return nil, response.GeneralError(err)
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

func (s *authUseCase) ResendOTP(req domain.ResendOTPRequest) (*domain.AuthResponse, error) {
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

func (s *authUseCase) Login(req domain.LoginRequest) (*domain.AuthResponse, error) {
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

	// Store refresh token
	rfToken := &domain.RefreshToken{
		UserID:    user.ID,
		Token:     refreshToken,
		ExpiresAt: time.Now().Add(time.Hour * 24 * 7),
	}
	if err := s.tokenRepo.Create(rfToken); err != nil {
		return nil, response.GeneralError(err)
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

func (s *authUseCase) RefreshToken(req domain.RefreshTokenRequest) (*domain.AuthResponse, error) {
	rt, err := s.tokenRepo.FindByToken(req.RefreshToken)
	if err != nil {
		return nil, response.Unauthorized("invalid or expired refresh token")
	}

	accessToken, refreshToken, err := utils.GenerateTokens(rt.UserID, s.secretKey)
	if err != nil {
		return nil, err
	}

	if err := s.tokenRepo.RevokeToken(req.RefreshToken); err != nil {
		fmt.Printf("failed to revoke old token: %v\n", err)
	}

	newRFToken := &domain.RefreshToken{
		UserID:    rt.UserID,
		Token:     refreshToken,
		ExpiresAt: time.Now().Add(time.Hour * 24 * 7),
	}
	if err := s.tokenRepo.Create(newRFToken); err != nil {
		return nil, response.GeneralError(err)
	}

	user, err := s.repo.FindByID(rt.UserID)
	if err != nil {
		return nil, response.BadRequest("user not found")
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

func (s *authUseCase) Logout(token string) error {
	return s.tokenRepo.RevokeToken(token)
}
