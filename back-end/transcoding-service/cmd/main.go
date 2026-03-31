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
}

type VideoProcessedEvent struct {
	VideoID string `json:"video_id"`
	HLSURL  string `json:"hls_url"`
	Status  string `json:"status"`
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

		log.Printf("📥 Processing video: %s (%s)", event.Title, event.VideoID)

		// 4. SIMULATED TRANSCODING + STORAGE UPLOAD
		// Upload a dummy master.m3u8 to the hls bucket
		time.Sleep(5 * time.Second) // Simulate FFmpeg processing time

		hlsPath := fmt.Sprintf("%s/master.m3u8", event.VideoID)
		dummyManifest := "#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-STREAM-INF:BANDWIDTH=1280000,RESOLUTION=1280x720\nchunk_0.ts"

		// Use a temporary file to upload to MinIO
		tmpFile := "/tmp/master.m3u8"
		os.WriteFile(tmpFile, []byte(dummyManifest), 0644)

		err = store.UploadFile(context.Background(), "hls", hlsPath, tmpFile, "application/x-mpegURL")
		if err != nil {
			log.Printf("❌ Failed to upload HLS manifest to MinIO: %v", err)
			// Continue anyway for the "Success" signal flow
		} else {
			log.Printf("✅ Uploaded HLS manifest: hls/%s", hlsPath)
		}

		// 5. Emit Processed Event
		processedEvent := VideoProcessedEvent{
			VideoID: event.VideoID,
			HLSURL:  fmt.Sprintf("http://localhost:9000/hls/%s", hlsPath),
			Status:  "completed",
		}
		processedBytes, _ := json.Marshal(processedEvent)

		err = producer.SendMessage(context.Background(), kafka.TranscodingCompletedTopic, []byte(event.VideoID), processedBytes)
		if err != nil {
			log.Printf("failed to emit processed event: %v", err)
			continue
		}

		log.Printf("Successfully processed video: %s", event.VideoID)
	}
}
