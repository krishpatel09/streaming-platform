package main

import (
	"context"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/notification-service/internal/api/handler"
	"github.com/krishpatel09/streaming-platform/notification-service/internal/api/router"
	"github.com/krishpatel09/streaming-platform/notification-service/internal/config"
	"github.com/krishpatel09/streaming-platform/notification-service/internal/repository"
	"github.com/krishpatel09/streaming-platform/notification-service/internal/usecase"
	sharedConfig "github.com/krishpatel09/streaming-platform/shared/pkg/config"
	"github.com/krishpatel09/streaming-platform/shared/pkg/kafka"
)

func main() {
	// 1. Load Configuration
	cfg := config.Load()

	// 2. Initialize Shared MongoDB
	sharedConfig.ConnectMongo(cfg.DatabaseURL, cfg.DatabaseName)

	// 3. Initialize Kafka Consumer
	consumer := kafka.NewConsumer(cfg.KafkaBrokers, "notification-group", kafka.TranscodingCompletedTopic)
	defer consumer.Close()

	// 4. Initialize Clean Architecture Layers
	repo := repository.NewNotificationRepository(sharedConfig.DB)
	uc := usecase.NewNotificationUseCase(repo, consumer)
	h := handler.NewNotificationHandler(uc)

	// 5. Start Kafka Worker in Background
	go uc.Run(context.Background())

	// 6. Initialize Router
	r := gin.Default()
	router.RegisterRoutes(r, h)

	// 7. Start Server
	log.Printf("🚀 Notification Service (Clean Architecture) starting on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
