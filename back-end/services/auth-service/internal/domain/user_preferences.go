package domain

import (
	"time"

	"github.com/google/uuid"
)

type UserPreferences struct {
	ID                  uuid.UUID `gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	ProfileID           uuid.UUID `gorm:"type:uuid;not null;index;constraint:OnDelete:CASCADE"`
	PreferredGenres     []string  `gorm:"type:text[]"`
	PreferredLanguages  []string  `gorm:"type:text[]"`
	AutoplayNext        bool      `gorm:"default:true"`
	DefaultVideoQuality string    `gorm:"type:varchar(10);default:'auto'"`
	EmailNotifications  bool      `gorm:"default:true"`
	PushNotifications   bool      `gorm:"default:true"`
	UpdatedAt           time.Time `gorm:"default:now()"`

	Profile Profile `gorm:"foreignKey:ProfileID;references:ID"`
}

type UserPreferenceRequest struct {
	PreferredGenres     []string `json:"preferredGenres"`
	PreferredLanguages  []string `json:"preferredLanguages"`
	AutoplayNext        *bool    `json:"autoplayNext"`
	DefaultVideoQuality string   `json:"defaultVideoQuality"`
	EmailNotifications  *bool    `json:"emailNotifications"`
	PushNotifications   *bool    `json:"pushNotifications"`
}

type UserPreferenceResponse struct {
	PreferredGenres     []string `json:"preferredGenres"`
	PreferredLanguages  []string `json:"preferredLanguages"`
	AutoplayNext        bool     `json:"autoplayNext"`
	DefaultVideoQuality string   `json:"defaultVideoQuality"`
	EmailNotifications  bool     `json:"emailNotifications"`
	PushNotifications   bool     `json:"pushNotifications"`
}
