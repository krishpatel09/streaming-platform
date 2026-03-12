package main

import (
	"log"
	"os"

	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/config"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/di"
)

func main() {
	postgresCfg, err := config.LoadPostgresConfig()
	if err != nil {
		log.Fatalf("Failed to load postgres config: %v", err)
	}

	redisCfg, err := config.LoadRedisConfig()
	if err != nil {
		log.Fatalf("Failed to load redis config: %v", err)
	}

	engine, err := di.Initialize(postgresCfg, redisCfg)
	if err != nil {
		log.Fatalf("Failed to initialize dependencies: %v", err)
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "5002"
	}

	log.Printf("Starting auth-service on :%s", port)
	if err := engine.Run(":" + port); err != nil {
		log.Fatalf("Could not start server: %v", err)
	}
}
