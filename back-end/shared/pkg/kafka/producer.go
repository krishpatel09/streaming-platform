package kafka

import (
	"context"
	"fmt"
	"time"

	"github.com/segmentio/kafka-go"
)

type Producer interface {
	SendMessage(ctx context.Context, topic string, key []byte, value []byte) error
	Close() error
}

type kafkaProducer struct {
	writer *kafka.Writer
}

func NewProducer(brokers []string) Producer {
	return &kafkaProducer{
		writer: &kafka.Writer{
			Addr:                   kafka.TCP(brokers...),
			Balancer:               &kafka.LeastBytes{},
			AllowAutoTopicCreation: true,
			MaxAttempts:            10, // Higher retry count for metadata refresh
			BatchSize:              100,
			BatchTimeout:           10 * time.Millisecond,
			ReadTimeout:            10 * time.Second,
			WriteTimeout:           10 * time.Second,
			RequiredAcks:           kafka.RequiredAcks(-1), // Wait for all in-sync replicas (robust)
			Async:                  false,                  // Sync for better leadership awareness during retries
		},
	}
}

func (p *kafkaProducer) SendMessage(ctx context.Context, topic string, key []byte, value []byte) error {
	err := p.writer.WriteMessages(ctx, kafka.Message{
		Topic: topic,
		Key:   key,
		Value: value,
	})
	if err != nil {
		fmt.Printf("Error sending message to topic %s: %v\n", topic, err)
		return fmt.Errorf("failed to send message to kafka: %w", err)
	}
	fmt.Printf("Successfully sent message to topic %s\n", topic)
	return nil
}

func (p *kafkaProducer) Close() error {
	return p.writer.Close()
}
