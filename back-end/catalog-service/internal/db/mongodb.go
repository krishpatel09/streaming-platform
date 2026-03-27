package db

import (
	"context"
	"fmt"

	"github.com/krishpatel09/streaming-platform/catalog-service/internal/config"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectMongoDB(cfg config.MongoConfig) (*mongo.Client, error) {
	clientOptions := options.Client().ApplyURI(cfg.MongoUrl)

	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		return nil, err
	}

	if err = client.Ping(context.Background(), nil); err != nil {
		return nil, err
	}

	fmt.Println("MongoDB Connected Successfully")
	return client, nil
}
