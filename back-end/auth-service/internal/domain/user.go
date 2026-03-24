package domain

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID            uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Email         *string   `gorm:"type:varchar(255);uniqueIndex;where:email IS NOT NULL"`
	PhoneNumber   *string   `gorm:"type:varchar(20);uniqueIndex;where:phone_number IS NOT NULL"`
	PhoneVerified bool      `gorm:"not null;default:false"`
	IsVerified    bool      `gorm:"not null;default:false"`
	IsActive      bool      `gorm:"not null;default:true"`

	CreatedAt     time.Time      `gorm:"not null;default:now()"`
	UpdatedAt     time.Time      `gorm:"not null;default:now()"`
	RefreshTokens []RefreshToken `gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`
	Profiles      []Profile      `gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`
}

type OTPVerification struct {
	ID             uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Identifier     string    `gorm:"type:varchar(255);not null"`
	IdentifierType string    `gorm:"type:varchar(10);not null"`
	OTPHash        string    `gorm:"type:varchar(255);not null"`
	Purpose        string    `gorm:"type:varchar(20);not null"`
	Attempts       int       `gorm:"not null;default:0"`
	ExpiresAt      time.Time `gorm:"not null"`
	CreatedAt      time.Time `gorm:"not null;default:now()"`
}

type SendOTPRequest struct {
	Identifier     string `json:"identifier" binding:"required"`
	IdentifierType string `json:"identifier_type" binding:"required,oneof=phone email"`
	Purpose        string `json:"purpose" binding:"required,oneof=login verify 2fa"`
}

type VerifyOTPRequest struct {
	Identifier        string `json:"identifier" binding:"required"`
	IdentifierType    string `json:"identifier_type" binding:"required,oneof=phone email"`
	OTP               string `json:"otp" binding:"required,len=6"`
	DeviceFingerprint string `json:"device_fingerprint" binding:"required"`
	DeviceName        string `json:"device_name" binding:"required"`
	DeviceType        string `json:"device_type" binding:"required,oneof=mobile desktop tablet tv"`
}

type UserResponse struct {
	ID       uuid.UUID `json:"id"`
	Username string    `json:"username"`
	Email    string    `json:"email"`
}

type AuthTokens struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
	ExpiresIn    int    `json:"expiresIn"`
}

type AuthResponse struct {
	User   UserResponse `json:"user"`
	Tokens AuthTokens   `json:"tokens"`
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refreshToken" binding:"required"`
	DeviceInfo   string `json:"-"`
	IPAddress    string `json:"-"`
}
