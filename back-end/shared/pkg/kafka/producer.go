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
			Addr:         kafka.TCP(brokers...),
			Balancer:     &kafka.LeastBytes{},
			MaxAttempts:  5,
			BatchSize:    100,
			BatchTimeout: 10 * time.Millisecond,
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
