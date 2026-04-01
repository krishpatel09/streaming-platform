package repository

import (
	"context"

	"github.com/krishpatel09/streaming-platform/shared/pkg/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type VideoRepository interface {
	Insert(ctx context.Context, content bson.M) (interface{}, error)
	GetByID(ctx context.Context, id string) (bson.M, error)
	GetAll(ctx context.Context) ([]bson.M, error)
	Update(ctx context.Context, id string, data bson.M) error
	Delete(ctx context.Context, id string) error
}

type videoRepository struct {
	collection *mongo.Collection
}

func NewVideoRepository() VideoRepository {
	return &videoRepository{
		collection: config.GetCollection("admin_contents"),
	}
}

func (r *videoRepository) Insert(ctx context.Context, content bson.M) (interface{}, error) {
	res, err := r.collection.InsertOne(ctx, content)
	if err != nil {
		return nil, err
	}
	return res.InsertedID, nil
}

func (r *videoRepository) GetByID(ctx context.Context, id string) (bson.M, error) {
	objID, _ := primitive.ObjectIDFromHex(id)
	var content bson.M
	err := r.collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&content)
	return content, err
}

func (r *videoRepository) GetAll(ctx context.Context) ([]bson.M, error) {
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var results []bson.M
	if err := cursor.All(ctx, &results); err != nil {
		return nil, err
	}
	return results, nil
}

func (r *videoRepository) Update(ctx context.Context, id string, data bson.M) error {
	objID, _ := primitive.ObjectIDFromHex(id)
	_, err := r.collection.UpdateOne(ctx, bson.M{"_id": objID}, bson.M{"$set": data})
	return err
}

func (r *videoRepository) Delete(ctx context.Context, id string) error {
	objID, _ := primitive.ObjectIDFromHex(id)
	_, err := r.collection.DeleteOne(ctx, bson.M{"_id": objID})
	return err
}
