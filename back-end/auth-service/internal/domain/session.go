package domain

import (
	"time"

	"github.com/google/uuid"
)

type OTPBypass struct {
	ID         uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID     uuid.UUID  `gorm:"type:uuid;not null;index" json:"user_id"`
	DeviceID   uuid.UUID  `gorm:"type:uuid;not null;index" json:"device_id"`
	ValidUntil time.Time  `gorm:"not null" json:"valid_until"`
	CreatedAt  time.Time  `gorm:"not null;default:now()" json:"created_at"`
	RevokedAt  *time.Time `json:"revoked_at"`

	User   User   `gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE" json:"-"`
	Device Device `gorm:"foreignKey:DeviceID;references:ID;constraint:OnDelete:CASCADE" json:"-"`
}

type SessionActivity struct {
	ID             uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	RefreshTokenID *uuid.UUID `gorm:"type:uuid;index" json:"refresh_token_id"`
	Action         string    `gorm:"type:varchar(50);not null" json:"action"` // 'otp_verified' | 'token_refresh' | 'logout'
	IPAddress      string    `gorm:"type:inet" json:"ip_address"`
	UserAgent      string    `gorm:"type:text" json:"user_agent"`
	CreatedAt      time.Time `gorm:"not null;default:now()" json:"created_at"`
}
