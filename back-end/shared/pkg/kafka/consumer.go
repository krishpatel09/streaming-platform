package kafka

import (
	"context"
	"fmt"
	"time"

	"github.com/segmentio/kafka-go"
)

type Consumer interface {
	ReadMessage(ctx context.Context) (kafka.Message, error)
	Close() error
}

type kafkaConsumer struct {
	reader *kafka.Reader
}

func NewConsumer(brokers []string, groupID string, topics ...string) Consumer {
	return &kafkaConsumer{
		reader: kafka.NewReader(kafka.ReaderConfig{
			Brokers:        brokers,
			GroupID:        groupID,
			GroupTopics:    topics,
			MinBytes:       10e3, // 10KB
			MaxBytes:       10e6, // 10MB
			MaxWait:        1 * time.Second,
			CommitInterval: 1 * time.Second,
			StartOffset:    kafka.LastOffset,
		}),
	}
}

func (c *kafkaConsumer) ReadMessage(ctx context.Context) (kafka.Message, error) {
	msg, err := c.reader.ReadMessage(ctx)
	if err != nil {
		return kafka.Message{}, fmt.Errorf("failed to read message from kafka: %w", err)
	}
	return msg, nil
}

func (c *kafkaConsumer) Close() error {
	return c.reader.Close()
}
