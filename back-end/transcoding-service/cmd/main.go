package main

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/krishpatel09/streaming-platform/shared/pkg/kafka"
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
	brokers := []string{"localhost:9092"}

	// 1. Initialize Consumer
	consumer := kafka.NewConsumer(brokers, "transcoding-group", kafka.VideoUploadedTopic)
	defer consumer.Close()

	// 2. Initialize Producer
	producer := kafka.NewProducer(brokers)
	defer producer.Close()

	log.Println("Transcoding Service started, waiting for events...")

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

		log.Printf("Processing video: %s (%s)", event.Title, event.VideoID)

		// 3. MOCK TRANSCODING LOGIC
		time.Sleep(5 * time.Second) // Simulate FFmpeg
		hlsURL := "http://localhost:9000/hls/" + event.VideoID + "/master.m3u8"

		// 4. Emit Processed Event
		processedEvent := VideoProcessedEvent{
			VideoID: event.VideoID,
			HLSURL:  hlsURL,
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
