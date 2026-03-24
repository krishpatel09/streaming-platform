package domain

import (
	"time"

	"github.com/google/uuid"
)

type Device struct {
	ID                uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID            uuid.UUID `gorm:"type:uuid;not null;index"`
	DeviceFingerprint string    `gorm:"type:varchar(512);not null;uniqueIndex"`
	DeviceName        string    `gorm:"type:varchar(100)"`
	DeviceType        string    `gorm:"type:varchar(20);not null;default:'desktop'"`
	IsTrusted         bool      `gorm:"not null;default:false"`
	LastSeenAt        *time.Time
	CreatedAt         time.Time `gorm:"not null;default:now()"`

	User User `gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`
}

type RefreshToken struct {
	ID                     uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	UserID                 uuid.UUID  `gorm:"type:uuid;not null;index"`
	DeviceID               *uuid.UUID `gorm:"type:uuid;index"`
	TokenHash              string     `gorm:"type:varchar(255);not null;uniqueIndex"`
	SessionLabel           string     `gorm:"type:varchar(100)"`
	DeviceInfo             *string    `gorm:"type:jsonb"`
	IPAddress              string     `gorm:"type:inet"`
	LastActivityAt         time.Time  `gorm:"not null;default:now()"`
	ExpiresAt              time.Time  `gorm:"not null"`
	RevokedAt              *time.Time
	RequiresReverification bool      `gorm:"not null;default:false"`
	CreatedAt              time.Time `gorm:"not null;default:now()"`

	User   User    `gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`
	Device *Device `gorm:"foreignKey:DeviceID;references:ID;constraint:OnDelete:SET NULL"`
}
