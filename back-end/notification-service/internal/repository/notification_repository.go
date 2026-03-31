package repository

import (
	"context"
	"time"

	"github.com/krishpatel09/streaming-platform/notification-service/internal/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type NotificationRepository interface {
	Save(ctx context.Context, notification *model.Notification) error
	GetByVideoID(ctx context.Context, videoID string) (*model.Notification, error)
}

type mongoRepository struct {
	db *mongo.Database
}

func NewNotificationRepository(db *mongo.Database) NotificationRepository {
	return &mongoRepository{db: db}
}

func (r *mongoRepository) Save(ctx context.Context, n *model.Notification) error {
	collection := r.db.Collection("notifications")
	n.CreatedAt = time.Now()
	_, err := collection.InsertOne(ctx, n)
	return err
}

func (r *mongoRepository) GetByVideoID(ctx context.Context, videoID string) (*model.Notification, error) {
	collection := r.db.Collection("notifications")
	var n model.Notification
	err := collection.FindOne(ctx, bson.M{"video_id": videoID}).Decode(&n)
	return &n, err
}
