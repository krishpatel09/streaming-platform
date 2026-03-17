package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID            uuid.UUID      `gorm:"type:uuid;primaryKey"`
	Username      string         `gorm:"not null"`
	Email         string         `gorm:"uniqueIndex;not null"`
	Password      string         `gorm:"not null"`
	AvatarURL     string         `gorm:"type:text"`
	IsVerified    bool           `gorm:"default:false"`
	IsActive      bool           `gorm:"default:true"`
	CreatedAt     time.Time      `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt     time.Time      `gorm:"default:CURRENT_TIMESTAMP"`
	RefreshTokens []RefreshToken `gorm:"foreignKey:UserID;references:ID"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return
}

type RegisterRequest struct {
	Username string `json:"username" binding:"required,min=3"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginRequest struct {
	Email      string `json:"email" binding:"required,email"`
	Password   string `json:"password" binding:"required"`
	DeviceInfo string `json:"-"`
	IPAddress  string `json:"-"`
}

type VerifyOTPRequest struct {
	Email      string `json:"email" binding:"required,email"`
	OTP        string `json:"otp" binding:"required,len=6"`
	DeviceInfo string `json:"-"`
	IPAddress  string `json:"-"`
}

type ResendOTPRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type LogoutRequest struct {
	RefreshToken string `json:"refreshToken" binding:"required"`
}

type UserResponse struct {
	ID         uuid.UUID `json:"id"`
	Username   string    `json:"username"`
	Email      string    `json:"email"`
	IsVerified bool      `json:"isVerified"`
}

type AuthResponse struct {
	AccessToken  string       `json:"accessToken,omitempty"`
	RefreshToken string       `json:"refreshToken,omitempty"`
	User         UserResponse `json:"user"`
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refreshToken" binding:"required"`
	DeviceInfo   string `json:"-"`
	IPAddress    string `json:"-"`
}
