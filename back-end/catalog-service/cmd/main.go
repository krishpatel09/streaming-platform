package main

import (
	"context"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/catalog-service/internal/api/handler"
	"github.com/krishpatel09/streaming-platform/catalog-service/internal/api/router"
	"github.com/krishpatel09/streaming-platform/catalog-service/internal/config"
	"github.com/krishpatel09/streaming-platform/catalog-service/internal/db"
	"github.com/krishpatel09/streaming-platform/catalog-service/internal/repository"
	"github.com/krishpatel09/streaming-platform/catalog-service/internal/usecase"
	"github.com/krishpatel09/streaming-platform/catalog-service/internal/worker"
	"github.com/krishpatel09/streaming-platform/shared/pkg/kafka"
)

func main() {
	// 1. Load Config
	mongoCfg, _ := config.LoadMongoConfig()

	// 2. Connect DB
	client, err := db.ConnectMongoDB(mongoCfg)
	if err != nil {
		log.Fatalf("failed to connect to mongodb: %v", err)
	}
	database := client.Database(mongoCfg.MongoDB)

	// 3. Initialize Kafka Consumer
	brokerStr := mongoCfg.KafkaBrokers
	if brokerStr == "" {
		brokerStr = "localhost:9092"
	}
	brokers := []string{brokerStr}
	topics := []string{kafka.ContentAddedTopic, kafka.TranscodingCompletedTopic}
	consumer := kafka.NewConsumer(brokers, "catalog-group", topics...)
	defer consumer.Close()

	// 4. Initialize Layers
	repo := repository.NewCatalogRepository(database)
	uc := usecase.NewCatalogUseCase(repo)
	h := handler.NewCatalogHandler(uc)

	// 5. Start Kafka Worker
	contentWorker := worker.NewContentConsumer(consumer, uc)
	go contentWorker.Start(context.Background())

	// 6. Setup Server
	port := mongoCfg.Port
	if port == "" {
		port = "8003"
	}

	r := gin.Default()
	router.Register(r, h)

	log.Printf("🚀 Catalog Service started on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
