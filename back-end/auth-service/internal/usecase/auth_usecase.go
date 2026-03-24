package usecase

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/krishpatel09/streaming-platform/auth-service/internal/domain"
	"github.com/krishpatel09/streaming-platform/auth-service/internal/repository"
	"github.com/krishpatel09/streaming-platform/auth-service/internal/utils"
	email "github.com/krishpatel09/streaming-platform/auth-service/internal/utils/emails"
	sms "github.com/krishpatel09/streaming-platform/auth-service/internal/utils/phone_number"
	"github.com/krishpatel09/streaming-platform/auth-service/internal/utils/response"
	"github.com/krishpatel09/streaming-platform/shared/pkg/jwt"
)

type AuthUseCase interface {
	SendOTP(req domain.SendOTPRequest) error
	VerifyOTP(req domain.VerifyOTPRequest) (*domain.AuthResponse, error)
	RefreshToken(req domain.RefreshTokenRequest) (*domain.AuthResponse, error)
	Logout(token string) error
	GetSessions(userID uuid.UUID) ([]domain.RefreshToken, error)
	RevokeSession(userID, sessionID uuid.UUID) error
}

type authUseCase struct {
	repo        repository.UserRepository
	otpRepo     repository.OTPRepository
	redisRepo   repository.RedisRepository
	tokenRepo   repository.RefreshTokenRepository
	profileRepo repository.ProfileRepository
	sessionRepo repository.SessionRepository
	emailUtil   *email.EmailSender
	smsUtil     *sms.SMSSender
	secretKey   string
}

func NewAuthUseCase(
	repo repository.UserRepository,
	otpRepo repository.OTPRepository,
	redisRepo repository.RedisRepository,
	tokenRepo repository.RefreshTokenRepository,
	profileRepo repository.ProfileRepository,
	sessionRepo repository.SessionRepository,
	emailUtil *email.EmailSender,
	smsUtil *sms.SMSSender,
	secretKey string,
) AuthUseCase {
	return &authUseCase{
		repo:        repo,
		otpRepo:     otpRepo,
		redisRepo:   redisRepo,
		tokenRepo:   tokenRepo,
		profileRepo: profileRepo,
		sessionRepo: sessionRepo,
		emailUtil:   emailUtil,
		smsUtil:     smsUtil,
		secretKey:   secretKey,
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
	fmt.Println("otp: ", otp)
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
		return nil, response.GeneralError(err)
	}

	// Session activity logging and limit enforcement
	if err := s.sessionRepo.RevokeOldestSession(user.ID, 5); err != nil {
		fmt.Printf("warning: failed to revoke oldest session: %v\n", err)
	}

	accessToken, refreshToken, err := jwt.GenerateTokens(user.ID, s.secretKey)
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

	// Create Primary Profile if none exists
	profiles, _ := s.profileRepo.FindByUserID(user.ID)
	if len(profiles) == 0 {
		primaryProfile := &domain.Profile{
			UserID:      user.ID,
			ProfileName: "Primary",
			IsPrimary:   true,
		}
		prefs := &domain.UserPreference{
			AutoplayNext:        true,
			DefaultVideoQuality: "auto",
			EmailNotifications:  true,
			PushNotifications:   true,
		}
		if err := s.profileRepo.CreateWithPreferences(primaryProfile, prefs); err != nil {
			fmt.Printf("warning: failed to create primary profile: %v\n", err)
		}
	}

	// Log Session Activity
	_ = s.sessionRepo.LogActivity(&domain.SessionActivity{
		RefreshTokenID: &rfToken.ID,
		Action:         "otp_verified",
		IPAddress:      "0.0.0.0",
		UserAgent:      req.DeviceName, // Snapshot from req
	})

	// Create initial OTP bypass for this device (trusted for 30 days)
	_ = s.sessionRepo.CreateOTPBypass(&domain.OTPBypass{
		UserID:     user.ID,
		DeviceID:   device.ID,
		ValidUntil: time.Now().Add(30 * 24 * time.Hour),
	})

	emailStr := ""
	if user.Email != nil {
		emailStr = *user.Email
	}

	return &domain.AuthResponse{
		User: domain.UserResponse{
			ID:    user.ID,
			Email: emailStr,
		},
		Tokens: domain.AuthTokens{
			AccessToken:  accessToken,
			RefreshToken: refreshToken,
			ExpiresIn:    900,
		},
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
		// Check for active OTP bypass (trusted device)
		bypass, err := s.sessionRepo.CheckOTPBypass(rt.UserID, *rt.DeviceID)
		if err != nil || bypass == nil {
			return nil, response.Unauthorized("REVERIFICATION_REQUIRED")
		}
	}

	_ = s.tokenRepo.UpdateActivity(rt.ID)

	// Log Session Activity
	_ = s.sessionRepo.LogActivity(&domain.SessionActivity{
		RefreshTokenID: &rt.ID,
		Action:         "token_refresh",
		IPAddress:      rt.IPAddress,
		UserAgent:      rt.SessionLabel,
	})

	accessToken, _, err := jwt.GenerateTokens(rt.UserID, s.secretKey)
	if err != nil {
		return nil, response.GeneralError(err)
	}
	return &domain.AuthResponse{
		Tokens: domain.AuthTokens{
			AccessToken: accessToken,
			ExpiresIn:   900,
		},
	}, nil
}

func (s *authUseCase) Logout(token string) error {
	tokenHash := utils.HashOTP(token)
	rt, err := s.tokenRepo.FindByHash(tokenHash)
	if err == nil {
		_ = s.sessionRepo.LogActivity(&domain.SessionActivity{
			RefreshTokenID: &rt.ID,
			Action:         "logout",
			IPAddress:      rt.IPAddress,
			UserAgent:      rt.SessionLabel,
		})
	}

	_ = s.redisRepo.DeleteRefreshToken(token)
	return s.tokenRepo.RevokeByHash(tokenHash)
}

func (s *authUseCase) GetSessions(userID uuid.UUID) ([]domain.RefreshToken, error) {
	return s.sessionRepo.GetActiveSessions(userID)
}

func (s *authUseCase) RevokeSession(userID, sessionID uuid.UUID) error {
	// 1. Verify session belongs to user
	sessions, err := s.sessionRepo.GetActiveSessions(userID)
	if err != nil {
		return response.GeneralError(err)
	}

	found := false
	for _, sess := range sessions {
		if sess.ID == sessionID {
			found = true
			break
		}
	}

	if !found {
		return response.Unauthorized("SESSION_NOT_FOUND_OR_NOT_YOURS")
	}

	return s.sessionRepo.RevokeSession(sessionID)
}
