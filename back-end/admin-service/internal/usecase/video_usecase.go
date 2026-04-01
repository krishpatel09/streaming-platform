package usecase

import (
	"context"
	"encoding/json"
	"log"
	"strings"
	"time"

	"github.com/krishpatel09/streaming-platform/admin-service/internal/repository"
	"github.com/krishpatel09/streaming-platform/shared/pkg/kafka"
	"github.com/krishpatel09/streaming-platform/shared/pkg/utils"
	"go.mongodb.org/mongo-driver/bson"
)

type VideoUseCase interface {
	AddContent(ctx context.Context, content bson.M) (interface{}, error)
	GetAllContent(ctx context.Context) ([]bson.M, error)
	GetContentByID(ctx context.Context, id string) (bson.M, error)
	UpdateContent(ctx context.Context, id string, data bson.M) error
	DeleteContent(ctx context.Context, id string) error
	NotifyUploadComplete(ctx context.Context, videoID, title, description, storagePath string) error
}

type videoUseCase struct {
	repo     repository.VideoRepository
	producer kafka.Producer
}

func NewVideoUseCase(r repository.VideoRepository, p kafka.Producer) VideoUseCase {
	return &videoUseCase{repo: r, producer: p}
}

func (u *videoUseCase) AddContent(ctx context.Context, content bson.M) (interface{}, error) {
	// 1. Generate slug from title if not provided
	if slug, ok := content["slug"].(string); !ok || slug == "" {
		// Use map[string]interface{} as that's what json.Unmarshal produces for nested objects
		if title, ok := content["title"].(map[string]interface{}); ok {
			if defaultTitle, ok := title["default"].(string); ok {
				content["slug"] = utils.Slugify(defaultTitle)
			}
		} else if title, ok := content["title"].(bson.M); ok {
			if defaultTitle, ok := title["default"].(string); ok {
				content["slug"] = utils.Slugify(defaultTitle)
			}
		} else if titleStr, ok := content["title"].(string); ok {
			content["slug"] = utils.Slugify(titleStr)
		}
	}

	if slug, ok := content["slug"].(string); ok && slug != "" {
		log.Printf("🛠️  Auto-generated slug: %s", slug)
	}

	id, err := u.repo.Insert(ctx, content)
	if err != nil {
		return nil, err
	}

	// Add the generated ID to the content map so Catalog Service/Kafka receives it
	now := time.Now()
	content["id"] = id
	content["status"] = "processing"
	content["created_at"] = now
	content["updated_at"] = now

	// Emit Kafka Event
	contentBytes, _ := json.Marshal(content)
	u.producer.SendMessage(ctx, kafka.ContentAddedTopic, nil, contentBytes)

	return id, nil
}

func (u *videoUseCase) GetAllContent(ctx context.Context) ([]bson.M, error) {
	return u.repo.GetAll(ctx)
}

func (u *videoUseCase) GetContentByID(ctx context.Context, id string) (bson.M, error) {
	return u.repo.GetByID(ctx, id)
}

func (u *videoUseCase) UpdateContent(ctx context.Context, id string, data bson.M) error {
	err := u.repo.Update(ctx, id, data)
	if err != nil {
		return err
	}

	// Fetch full updated document to sync with Catalog Service
	updated, err := u.repo.GetByID(ctx, id)
	if err == nil {
		updated["id"] = id // Ensure ID is present for catalog unmarshaler
		contentBytes, _ := json.Marshal(updated)
		u.producer.SendMessage(ctx, kafka.ContentAddedTopic, nil, contentBytes)
	}

	return nil
}

func (u *videoUseCase) DeleteContent(ctx context.Context, id string) error {
	return u.repo.Delete(ctx, id)
}

func (u *videoUseCase) NotifyUploadComplete(ctx context.Context, videoID, title, description, storagePath string) error {
	// Determine the type from the storage path
	mediaType := "source"
	if strings.Contains(storagePath, "_trailer") {
		mediaType = "trailer"
	}

	event := map[string]string{
		"video_id":     videoID,
		"title":        title,
		"description":  description,
		"storage_path": storagePath,
		"type":         mediaType,
	}
	eventBytes, _ := json.Marshal(event)
	return u.producer.SendMessage(ctx, kafka.VideoUploadedTopic, []byte(videoID), eventBytes)
}
