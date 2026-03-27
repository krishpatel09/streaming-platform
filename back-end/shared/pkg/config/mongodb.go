package config

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Database

func ConnectMongo(uri string, dbName string) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal("Mongo Connection Error:", err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Mongo Ping Error:", err)
	}

	DB = client.Database(dbName)
	log.Println("✅ MongoDB Connected:", dbName)
}

func GetCollection(name string) *mongo.Collection {
	return DB.Collection(name)
}
