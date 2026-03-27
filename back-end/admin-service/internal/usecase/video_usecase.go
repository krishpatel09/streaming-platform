package usecase

import (
	"context"
	"encoding/json"

	"github.com/krishpatel09/streaming-platform/admin-service/internal/repository"
	"github.com/krishpatel09/streaming-platform/shared/pkg/kafka"
	"go.mongodb.org/mongo-driver/bson"
)

type VideoUseCase interface {
	AddContent(ctx context.Context, content bson.M) (interface{}, error)
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
	id, err := u.repo.Insert(ctx, content)
	if err != nil {
		return nil, err
	}

	// Emit Kafka Event
	contentBytes, _ := json.Marshal(content)
	u.producer.SendMessage(ctx, kafka.ContentAddedTopic, nil, contentBytes)

	return id, nil
}

func (u *videoUseCase) UpdateContent(ctx context.Context, id string, data bson.M) error {
	return u.repo.Update(ctx, id, data)
}

func (u *videoUseCase) DeleteContent(ctx context.Context, id string) error {
	return u.repo.Delete(ctx, id)
}

func (u *videoUseCase) NotifyUploadComplete(ctx context.Context, videoID, title, description, storagePath string) error {
	event := map[string]string{
		"video_id":     videoID,
		"title":        title,
		"description":  description,
		"storage_path": storagePath,
	}
	eventBytes, _ := json.Marshal(event)
	return u.producer.SendMessage(ctx, kafka.VideoUploadedTopic, []byte(videoID), eventBytes)
}
