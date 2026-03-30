package main

import (
	"context"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/shared/pkg/storage"
	"github.com/krishpatel09/streaming-platform/streaming-service/internal/api/handler"
	"github.com/krishpatel09/streaming-platform/streaming-service/internal/api/router"
)

func main() {
	// Initialize Storage (MinIO)
	endpoint := os.Getenv("STORAGE_ENDPOINT")
	if endpoint == "" {
		endpoint = "localhost:9000"
	}
	accessKey := os.Getenv("STORAGE_ACCESS_KEY")
	secretKey := os.Getenv("STORAGE_SECRET_KEY")
	useSSL := os.Getenv("STORAGE_USE_SSL") == "true"

	publicEndpoint := os.Getenv("STORAGE_PUBLIC_ENDPOINT")
	s, err := storage.NewMinioStorage(endpoint, accessKey, secretKey, useSSL, publicEndpoint)
	if err != nil {
		log.Fatalf("failed to connect to minio: %v", err)
	}

	// Ensure required buckets exist
	buckets := []string{"videos", "hls"}
	for _, bucket := range buckets {
		if err := s.CreateBucket(context.Background(), bucket); err != nil {
			log.Fatalf("failed to initialize bucket '%s': %v", bucket, err)
		}
	}

	h := handler.NewStreamingHandler(s)
	r := gin.Default()
	router.Register(r, h)

	port := os.Getenv("STREAMING_PORT")
	if port == "" {
		port = "8005"
	}

	log.Printf("Streaming Service starting on :%s", port)
	r.Run(":" + port)
}
