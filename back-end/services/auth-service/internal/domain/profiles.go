package domain

import (
	"time"

	"github.com/google/uuid"
)

type Profile struct {
	ID            uuid.UUID `gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	UserID        uuid.UUID `gorm:"type:uuid;not null;index;constraint:OnDelete:CASCADE"`
	ProfileName   string    `gorm:"type:varchar(50);not null"`
	AvatarURL     string    `gorm:"type:text"`
	IsKidsProfile bool      `gorm:"default:false"`
	IsPrimary     bool      `gorm:"default:false"`
	PinCodeHash   string    `gorm:"type:varchar(255)"`
	CreatedAt     time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt     time.Time `gorm:"default:CURRENT_TIMESTAMP"`

	User        User              `gorm:"foreignKey:UserID;references:ID"`
	Preferences []UserPreferences `gorm:"foreignKey:ProfileID;references:ID"`
}
