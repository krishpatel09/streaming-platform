package usecase

import (
	"context"
	"time"

	"github.com/krishpatel09/streaming-platform/catalog-service/internal/models"
	"github.com/krishpatel09/streaming-platform/catalog-service/internal/repositery"
)

type CatalogUseCase interface {
	CreateVideoRecord(ctx context.Context, title, description string) (*models.Content, error)
	CreateVideoRecordFromContent(ctx context.Context, content *models.Content) error
	GetAllContent(ctx context.Context) ([]models.Content, error)
	GetContentByID(ctx context.Context, id string) (*models.Content, error)
	SearchContent(ctx context.Context, query string) ([]models.Content, error)
	UpdateStatus(ctx context.Context, videoID, hlsURL, status string) error
}

type catalogUseCase struct {
	repo repositery.CatalogRepository
}

func NewCatalogUseCase(repo repositery.CatalogRepository) CatalogUseCase {
	return &catalogUseCase{repo: repo}
}

func (u *catalogUseCase) CreateVideoRecord(ctx context.Context, title, description string) (*models.Content, error) {
	now := time.Now()
	video := &models.Content{
		Title: models.LocalizedTitle{
			Default: title,
		},
		Description: description,
		Status:      "processing",
		CreatedAt:   &now,
		UpdatedAt:   &now,
	}

	err := u.repo.CreateVideo(ctx, video)
	return video, err
}

func (u *catalogUseCase) CreateVideoRecordFromContent(ctx context.Context, content *models.Content) error {
	now := time.Now()
	content.CreatedAt = &now
	content.UpdatedAt = &now
	// Ensure status is processing initially if not set
	if content.Status == "" {
		content.Status = "processing"
	}
	return u.repo.CreateVideo(ctx, content)
}

func (u *catalogUseCase) GetAllContent(ctx context.Context) ([]models.Content, error) {
	return u.repo.GetAll(ctx)
}

func (u *catalogUseCase) GetContentByID(ctx context.Context, id string) (*models.Content, error) {
	return u.repo.GetByID(ctx, id)
}

func (u *catalogUseCase) SearchContent(ctx context.Context, query string) ([]models.Content, error) {
	return u.repo.Search(ctx, query)
}

func (u *catalogUseCase) UpdateStatus(ctx context.Context, videoID, hlsURL, status string) error {
	return u.repo.UpdateVideoStatus(ctx, videoID, hlsURL, status)
}
