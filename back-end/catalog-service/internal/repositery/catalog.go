package repositery

import (
	"context"

	"time"

	"github.com/krishpatel09/streaming-platform/catalog-service/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type CatalogRepository interface {
	CreateVideo(ctx context.Context, video *models.Content) error
	UpdateVideoStatus(ctx context.Context, videoID string, hlsURL string, status string) error
	GetAll(ctx context.Context) ([]models.Content, error)
	GetByID(ctx context.Context, id string) (*models.Content, error)
	Search(ctx context.Context, query string) ([]models.Content, error)
}

type mongoRepository struct {
	db         *mongo.Database
	collection *mongo.Collection
}

func NewCatalogRepository(db *mongo.Database) CatalogRepository {
	return &mongoRepository{
		db:         db,
		collection: db.Collection("catalog_contents"),
	}
}

func (r *mongoRepository) CreateVideo(ctx context.Context, video *models.Content) error {
	_, err := r.collection.InsertOne(ctx, video)
	return err
}

func (r *mongoRepository) UpdateVideoStatus(ctx context.Context, videoID string, hlsURL string, status string) error {
	objID, err := primitive.ObjectIDFromHex(videoID)
	if err != nil {
		return err
	}
	update := bson.M{
		"$set": bson.M{
			"status":                   status,
			"streaming.hls_master_url": hlsURL,
			"is_published":             status == "published" || status == "completed",
			"updated_at":               time.Now(),
		},
	}
	_, err = r.collection.UpdateOne(ctx, bson.M{"_id": objID}, update)
	return err
}

func (r *mongoRepository) GetAll(ctx context.Context) ([]models.Content, error) {
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	var results []models.Content
	err = cursor.All(ctx, &results)
	return results, err
}

func (r *mongoRepository) GetByID(ctx context.Context, id string) (*models.Content, error) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	var content models.Content
	err = r.collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&content)
	return &content, err
}

func (r *mongoRepository) Search(ctx context.Context, query string) ([]models.Content, error) {
	filter := bson.M{
		"$or": []bson.M{
			{"title.default": bson.M{"$regex": query, "$options": "i"}},
			{"description": bson.M{"$regex": query, "$options": "i"}},
		},
	}
	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	var results []models.Content
	err = cursor.All(ctx, &results)
	return results, err
}
