package usecase

import (
	"fmt"
	"time"

	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/domain"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/repository"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/utils"
	email "github.com/krishpatel09/streaming-platform/services/auth-service/internal/utils/emails"
	sms "github.com/krishpatel09/streaming-platform/services/auth-service/internal/utils/phone_number"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/utils/response"
)

type AuthUseCase interface {
	SendOTP(req domain.SendOTPRequest) error
	VerifyOTP(req domain.VerifyOTPRequest) (*domain.AuthResponse, error)
	RefreshToken(req domain.RefreshTokenRequest) (*domain.AuthResponse, error)
	Logout(token string) error
}

type authUseCase struct {
	repo      repository.UserRepository
	otpRepo   repository.OTPRepository
	redisRepo repository.RedisRepository
	tokenRepo repository.RefreshTokenRepository
	emailUtil *email.EmailSender
	smsUtil   *sms.SMSSender
	secretKey string
}

func NewAuthUseCase(
	repo repository.UserRepository,
	otpRepo repository.OTPRepository,
	redisRepo repository.RedisRepository,
	tokenRepo repository.RefreshTokenRepository,
	emailUtil *email.EmailSender,
	smsUtil *sms.SMSSender,
	secretKey string,
) AuthUseCase {
	return &authUseCase{
		repo:      repo,
		otpRepo:   otpRepo,
		redisRepo: redisRepo,
		tokenRepo: tokenRepo,
		emailUtil: emailUtil,
		smsUtil:   smsUtil,
		secretKey: secretKey,
	}
}

func (s *authUseCase) SendOTP(req domain.SendOTPRequest) error {
	count, err := s.otpRepo.CountLast10Mins(req.Identifier)
	if err == nil && count >= 3 {
		return response.BadRequest("too many otp requests. please try again later")
	}
	user, err := s.repo.FindByIdentifier(req.Identifier, req.IdentifierType)
	if err != nil {
		user = &domain.User{
			IsActive: true,
		}
		if req.IdentifierType == "email" {
			user.Email = &req.Identifier
		} else {
			user.PhoneNumber = &req.Identifier
		}

		if err := s.repo.Create(user); err != nil {
			return response.GeneralError(err)
		}
	}

	otp := utils.GenerateOTP()
	otpHash := utils.HashOTP(otp)

	otpVerif := &domain.OTPVerification{
		Identifier:     req.Identifier,
		IdentifierType: req.IdentifierType,
		OTPHash:        otpHash,
		Purpose:        req.Purpose,
		ExpiresAt:      time.Now().Add(5 * time.Minute),
	}
	if err := s.otpRepo.Create(otpVerif); err != nil {
		return response.GeneralError(err)
	}

	go func() {
		if req.IdentifierType == "email" {
			if err := s.emailUtil.SendOTP(req.Identifier, otp); err != nil {
				fmt.Printf("error: failed to send email otp: %v\n", err)
			}
		} else {
			if err := s.smsUtil.SendOTP(req.Identifier, otp); err != nil {
				fmt.Printf("error: failed to send sms otp: %v\n", err)
			}
		}
	}()

	return nil
}

func (s *authUseCase) VerifyOTP(req domain.VerifyOTPRequest) (*domain.AuthResponse, error) {
	otpVerif, err := s.otpRepo.GetLatest(req.Identifier, "login")
	if err != nil {
		return nil, response.BadRequest("otp expired or not found")
	}

	if otpVerif.Attempts >= 5 {
		return nil, response.BadRequest("max attempts reached. please request a new otp")
	}

	_ = s.otpRepo.IncrementAttempts(otpVerif.ID)

	if utils.HashOTP(req.OTP) != otpVerif.OTPHash {
		return nil, response.BadRequest("invalid otp")
	}

	_ = s.otpRepo.Delete(otpVerif.ID)

	user, err := s.repo.FindByIdentifier(req.Identifier, req.IdentifierType)
	if err != nil {
		return nil, response.BadRequest("user not found")
	}
	_ = s.repo.UpdateVerificationStatus(req.Identifier, req.IdentifierType, true)

	device := &domain.Device{
		UserID:            user.ID,
		DeviceFingerprint: req.DeviceFingerprint,
		DeviceName:        req.DeviceName,
		DeviceType:        req.DeviceType,
		LastSeenAt:        &[]time.Time{time.Now()}[0],
	}
	if err := s.repo.UpsertDevice(device); err != nil {
		fmt.Printf("warning: failed to upsert device: %v\n", err)
	}

	accessToken, refreshToken, err := utils.GenerateTokens(user.ID, s.secretKey)
	if err != nil {
		return nil, err
	}
	rfToken := &domain.RefreshToken{
		UserID:         user.ID,
		DeviceID:       &device.ID,
		TokenHash:      utils.HashOTP(refreshToken),
		SessionLabel:   req.DeviceName,
		IPAddress:      "0.0.0.0",
		ExpiresAt:      time.Now().Add(time.Hour * 24 * 30),
		LastActivityAt: time.Now(),
	}
	if err := s.tokenRepo.Create(rfToken); err != nil {
		return nil, response.GeneralError(err)
	}

	emailStr := ""
	if user.Email != nil {
		emailStr = *user.Email
	}

	return &domain.AuthResponse{
		User: domain.UserResponse{
			ID:    user.ID,
			Email: emailStr,
		},
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    900,
	}, nil

}

func (s *authUseCase) RefreshToken(req domain.RefreshTokenRequest) (*domain.AuthResponse, error) {
	tokenHash := utils.HashOTP(req.RefreshToken)

	rt, err := s.tokenRepo.FindByHash(tokenHash)
	if err != nil {
		return nil, response.Unauthorized("INVALID_REFRESH_TOKEN")
	}

	if rt.ExpiresAt.Before(time.Now()) {
		_ = s.tokenRepo.RevokeByHash(tokenHash)
		return nil, response.Unauthorized("SESSION_EXPIRED")
	}

	// 4. Idle Check
	idleLimit := 14 * 24 * time.Hour // default desktop
	if rt.Device != nil {
		switch rt.Device.DeviceType {
		case "mobile":
			idleLimit = 7 * 24 * time.Hour
		case "desktop":
			idleLimit = 14 * 24 * time.Hour
		case "tablet":
			idleLimit = 10 * 24 * time.Hour
		case "tv":
			idleLimit = 30 * 24 * time.Hour
		}
	}

	if time.Since(rt.LastActivityAt) > idleLimit {
		if rt.Device == nil || !rt.Device.IsTrusted {
			return nil, response.Unauthorized("REVERIFICATION_REQUIRED")
		}
	}

	_ = s.tokenRepo.UpdateActivity(rt.ID)

	accessToken, _, err := utils.GenerateTokens(rt.UserID, s.secretKey)
	if err != nil {
		return nil, response.GeneralError(err)
	}
	return &domain.AuthResponse{
		AccessToken: accessToken,
		ExpiresIn:   900,
	}, nil
}

func (s *authUseCase) Logout(token string) error {
	tokenHash := utils.HashOTP(token)
	_ = s.redisRepo.DeleteRefreshToken(token)
	return s.tokenRepo.RevokeByHash(tokenHash)
}
