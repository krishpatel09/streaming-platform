package repository

import (
	"github.com/google/uuid"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/domain"
	"gorm.io/gorm"
)

type UserRepository interface {
	Create(user *domain.User) error
	FindByIdentifier(identifier string, identifierType string) (*domain.User, error)
	FindByID(id uuid.UUID) (*domain.User, error)
	UpdateVerificationStatus(identifier string, identifierType string, status bool) error
	UpsertDevice(device *domain.Device) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(user *domain.User) error {
	return r.db.Create(user).Error
}

func (r *userRepository) FindByIdentifier(identifier string, identifierType string) (*domain.User, error) {
	var user domain.User
	query := r.db
	if identifierType == "email" {
		query = query.Where("email = ?", identifier)
	} else if identifierType == "phone" {
		query = query.Where("phone_number = ?", identifier)
	} else {
		return nil, gorm.ErrRecordNotFound
	}

	err := query.First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) FindByID(id uuid.UUID) (*domain.User, error) {
	var user domain.User
	err := r.db.Where("id = ?", id).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) UpdateVerificationStatus(identifier string, identifierType string, status bool) error {
	query := r.db.Model(&domain.User{})
	if identifierType == "email" {
		query = query.Where("email = ?", identifier)
	} else if identifierType == "phone" {
		query = query.Where("phone_number = ?", identifier)
	}
	return query.Update("is_verified", status).Error
}

func (r *userRepository) UpsertDevice(device *domain.Device) error {
	return r.db.Save(device).Error
}
