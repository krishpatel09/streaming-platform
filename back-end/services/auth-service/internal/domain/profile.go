package domain

import (
	"time"

	"github.com/google/uuid"
)

type Profile struct {
	ID            uuid.UUID      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID        uuid.UUID      `gorm:"type:uuid;not null;index" json:"user_id"`
	ProfileName   string         `gorm:"type:varchar(50);not null" json:"profile_name"`
	AvatarURL     *string        `gorm:"type:text" json:"avatar_url"`
	IsKidsProfile bool           `gorm:"not null;default:false" json:"is_kids_profile"`
	IsPrimary     bool           `gorm:"not null;default:false" json:"is_primary"`
	PinCodeHash   *string        `gorm:"type:varchar(255)" json:"-"`
	CreatedAt     time.Time      `gorm:"not null;default:now()" json:"created_at"`

	User        User           `gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE" json:"-"`
	Preferences UserPreference `gorm:"foreignKey:ProfileID;references:ID;constraint:OnDelete:CASCADE" json:"preferences"`
}

type UserPreference struct {
	ID                  uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	ProfileID           uuid.UUID `gorm:"type:uuid;not null;uniqueIndex" json:"profile_id"`
	PreferredGenres      []string  `gorm:"type:text[]" json:"preferred_genres"`
	PreferredLanguages   []string  `gorm:"type:text[]" json:"preferred_languages"`
	AutoplayNext         bool      `gorm:"not null;default:true" json:"autoplay_next"`
	DefaultVideoQuality  string    `gorm:"type:varchar(10);not null;default:'auto'" json:"default_video_quality"`
	EmailNotifications   bool      `gorm:"not null;default:true" json:"email_notifications"`
	PushNotifications    bool      `gorm:"not null;default:true" json:"push_notifications"`
	UpdatedAt           time.Time `gorm:"not null;default:now()" json:"updated_at"`
}
