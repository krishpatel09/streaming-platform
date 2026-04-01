package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/krishpatel09/streaming-platform/shared/pkg/kafka"
	"github.com/krishpatel09/streaming-platform/shared/pkg/storage"
)

type VideoUploadedEvent struct {
	VideoID     string `json:"video_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	StoragePath string `json:"storage_path"`
	Type        string `json:"type"` // "source" or "trailer"
}

type VideoProcessedEvent struct {
	VideoID string `json:"video_id"`
	HLSURL  string `json:"hls_url"`
	Status  string `json:"status"`
	Type    string `json:"type"` // Pass through
}

func main() {
	// 1. Configuration from environment
	kafkaBrokers := os.Getenv("KAFKA_BROKERS")
	if kafkaBrokers == "" {
		kafkaBrokers = "kafka:29092"
	}
	brokers := []string{kafkaBrokers}

	minioEndpoint := os.Getenv("STORAGE_ENDPOINT")
	if minioEndpoint == "" {
		minioEndpoint = "minio:9000"
	}
	accessKey := os.Getenv("STORAGE_ACCESS_KEY")
	secretKey := os.Getenv("STORAGE_SECRET_KEY")

	// 2. Initialize Storage Client
	store, err := storage.NewMinioStorage(minioEndpoint, accessKey, secretKey, false, "")
	if err != nil {
		log.Fatalf("failed to initialize storage: %v", err)
	}

	// 3. Initialize Kafka Consumer & Producer
	consumer := kafka.NewConsumer(brokers, "transcoding-group", kafka.VideoUploadedTopic)
	defer consumer.Close()

	producer := kafka.NewProducer(brokers)
	defer producer.Close()

	log.Println("🚀 Transcoding Service (Simulated) started, waiting for events...")

	for {
		msg, err := consumer.ReadMessage(context.Background())
		if err != nil {
			log.Printf("error reading message: %v", err)
			continue
		}

		var event VideoUploadedEvent
		if err := json.Unmarshal(msg.Value, &event); err != nil {
			log.Printf("error unmarshaling event: %v", err)
			continue
		}

		if event.Type == "" {
			event.Type = "source"
		}

		log.Printf("📥 Processing %s: %s (%s)", event.Type, event.Title, event.VideoID)

		// 4. SIMULATED TRANSCODING + STORAGE UPLOAD
		// Upload a dummy master.m3u8 to the hls bucket
		time.Sleep(5 * time.Second) // Simulate FFmpeg processing time

		// Type-specific HLS path
		hlsPath := fmt.Sprintf("%s/%s/master.m3u8", event.VideoID, event.Type)
		if event.Type == "source" {
			hlsPath = fmt.Sprintf("%s/master.m3u8", event.VideoID) // Maintain legacy path for main video
		}

		dummyManifest := "#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-STREAM-INF:BANDWIDTH=1280000,RESOLUTION=1280x720\nchunk_0.ts"

		// Use a temporary file to upload to MinIO
		tmpFile := "/tmp/master.m3u8"
		os.WriteFile(tmpFile, []byte(dummyManifest), 0644)

		err = store.UploadFile(context.Background(), "hls", hlsPath, tmpFile, "application/x-mpegURL")
		if err != nil {
			log.Printf("❌ Failed to upload HLS manifest to MinIO: %v", err)
		} else {
			log.Printf("✅ Uploaded HLS manifest: hls/%s", hlsPath)
		}

		// 5. Emit Processed Event
		processedEvent := VideoProcessedEvent{
			VideoID: event.VideoID,
			HLSURL:  fmt.Sprintf("http://localhost:9000/hls/%s", hlsPath),
			Status:  "completed",
			Type:    event.Type,
		}
		processedBytes, _ := json.Marshal(processedEvent)

		err = producer.SendMessage(context.Background(), kafka.TranscodingCompletedTopic, []byte(event.VideoID), processedBytes)
		if err != nil {
			log.Printf("failed to emit processed event: %v", err)
			continue
		}

		log.Printf("Successfully processed %s: %s", event.Type, event.VideoID)
	}
}
