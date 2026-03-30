package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/admin-service/internal/api/handler"
	"github.com/krishpatel09/streaming-platform/admin-service/internal/api/router"
	"github.com/krishpatel09/streaming-platform/admin-service/internal/config"
	"github.com/krishpatel09/streaming-platform/admin-service/internal/repository"
	"github.com/krishpatel09/streaming-platform/admin-service/internal/usecase"
	sharedConfig "github.com/krishpatel09/streaming-platform/shared/pkg/config"
	"github.com/krishpatel09/streaming-platform/shared/pkg/kafka"
)

func main() {
	// 1. Load Configuration
	cfg := config.Load()

	// 2. Initialize Shared MongoDB
	sharedConfig.ConnectMongo(cfg.DatabaseURL, cfg.DatabaseName)

	// 3. Initialize Kafka Infrastructure (Self-Provisioning)
	log.Println("⚡ Initializing Kafka Topics (Self-Provisioning Phase)...")
	if err := kafka.EnsureTopics(cfg.KafkaBrokers, kafka.AllTopics); err != nil {
		log.Fatalf("❌ Critical Failure: Failed to provision Kafka topics: %v", err)
	}

	// 4. Initialize Producer (Resilient Mode)
	producer := kafka.NewProducer(cfg.KafkaBrokers)
	defer producer.Close()

	// 5. Initialize Clean Architecture Layers
	repo := repository.NewVideoRepository()
	uc := usecase.NewVideoUseCase(repo, producer)
	h := handler.NewVideoHandler(uc, nil, producer) // Storage as mock

	// 4. Initialize Router & Register Routes
	r := gin.Default()
	router.RegisterRoutes(r, h)

	// 5. Start Server
	log.Printf("🚀 Admin Service starting on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
