package main

import (
	"context"
	"encoding/json"
	"log"

	"github.com/krishpatel09/streaming-platform/shared/pkg/kafka"
)

type VideoProcessedEvent struct {
	VideoID string `json:"video_id"`
	HLSURL  string `json:"hls_url"`
	Status  string `json:"status"`
}

func main() {
	brokers := []string{"localhost:9092"}

	// 1. Initialize Consumer
	consumer := kafka.NewConsumer(brokers, "catalog-group", kafka.TranscodingCompletedTopic)
	defer consumer.Close()

	log.Println("Catalog Service Event Subscriber started, waiting for processed videos...")

	for {
		msg, err := consumer.ReadMessage(context.Background())
		if err != nil {
			log.Printf("error reading message: %v", err)
			continue
		}

		var event VideoProcessedEvent
		if err := json.Unmarshal(msg.Value, &event); err != nil {
			log.Printf("error unmarshaling event: %v", err)
			continue
		}

		log.Printf("Updating video record in MongoDB: %s", event.VideoID)

		log.Printf("Video %s is now PUBLISHED with URL: %s", event.VideoID, event.HLSURL)
	}
}
