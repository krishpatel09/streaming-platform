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
	log.Println("📥 Kafka Consumer started for content-added topic...")
	for {
		msg, err := c.consumer.ReadMessage(ctx)
		if err != nil {
			log.Printf("Error reading message: %v", err)
			continue
		}

		var content models.Content
		if err := json.Unmarshal(msg.Value, &content); err != nil {
			log.Printf("Error unmarshaling content: %v", err)
			continue
		}

		log.Printf("New Content Received: %s", content.Title.Default)

		// Save the full content record to the catalog
		err = c.useCase.CreateVideoRecordFromContent(ctx, &content)
		if err != nil {
			log.Printf("Error saving content to catalog: %v", err)
		}
	}
}
