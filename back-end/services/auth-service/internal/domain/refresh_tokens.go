package domain

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RefreshToken struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey"`
	UserID     uuid.UUID `gorm:"type:uuid;not null;index;constraint:OnDelete:CASCADE"`
	Token      string    `gorm:"uniqueIndex;not null;type:varchar(255)"`
	DeviceInfo string    `gorm:"type:jsonb"`
	IPAddress  string    `gorm:"type:inet"`
	ExpiresAt  time.Time `gorm:"not null"`
	RevokedAt  *time.Time
	CreatedAt  time.Time `gorm:"default:now()"`

	User User `gorm:"foreignKey:UserID;references:ID"`
}

func (r *RefreshToken) BeforeCreate(tx *gorm.DB) (err error) {
	if r.ID == uuid.Nil {
		r.ID = uuid.New()
	}
	return
}
