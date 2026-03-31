package worker

import (
	"context"
	"encoding/json"
	"log"

	"github.com/krishpatel09/streaming-platform/catalog-service/internal/models"
	"github.com/krishpatel09/streaming-platform/catalog-service/internal/usecase"
	"github.com/krishpatel09/streaming-platform/shared/pkg/kafka"
)

type ContentConsumer struct {
	consumer kafka.Consumer
	useCase  usecase.CatalogUseCase
}

func NewContentConsumer(c kafka.Consumer, uc usecase.CatalogUseCase) *ContentConsumer {
	return &ContentConsumer{consumer: c, useCase: uc}
}

func (c *ContentConsumer) Start(ctx context.Context) {
	log.Println("📥 Kafka Consumer started for catalog-group (ContentAdded & TranscodingCompleted)...")
	for {
		msg, err := c.consumer.ReadMessage(ctx)
		if err != nil {
			log.Printf("Error reading message: %v", err)
			continue
		}

		log.Printf("📥 Received Kafka Message on topic: %s", msg.Topic)
		log.Printf("📦 Raw JSON Payload: %s", string(msg.Value))

		switch msg.Topic {
		case kafka.ContentAddedTopic:
			var content models.Content
			if err := json.Unmarshal(msg.Value, &content); err != nil {
				log.Printf("Error unmarshaling content: %v", err)
				continue
			}
			log.Printf("New Content Received: %s (ID: %s)", content.Title.Default, content.ID.Hex())
			if err := c.useCase.CreateVideoRecordFromContent(ctx, &content); err != nil {
				log.Printf("❌ FAILED to save content to catalog: %v", err)
			} else {
				log.Printf("✅ SUCCESS: Content saved to catalog_contents!")
			}

		case kafka.TranscodingCompletedTopic:
			var event struct {
				VideoID string `json:"video_id"`
				HLSURL  string `json:"hls_url"`
				Status  string `json:"status"`
			}
			if err := json.Unmarshal(msg.Value, &event); err != nil {
				log.Printf("Error unmarshaling processed event: %v", err)
				continue
			}
			log.Printf("✅ Transcoding Completed for Video: %s", event.VideoID)
			if err := c.useCase.UpdateStatus(ctx, event.VideoID, event.HLSURL, "published"); err != nil {
				log.Printf("Error updating status for video %s: %v", event.VideoID, err)
			}
		}
	}
}
