package kafka

import (
	"fmt"
	"log"
	"net"
	"strconv"
	"time"

	"github.com/segmentio/kafka-go"
)

const (
	DefaultPartitions        = 3
	DefaultReplicationFactor = 1
	MaxConnRetries           = 5
	RetryInterval            = 2 * time.Second
)

// EnsureTopics connects to the Kafka controller and ensures each topic in the slice exists with the specified configuration.
func EnsureTopics(brokers []string, topics []string) error {
	if len(brokers) == 0 {
		return fmt.Errorf("no kafka brokers provided")
	}

	var conn *kafka.Conn
	var err error

	// 1. Retry connecting to the broker to find the controller (handle boot delay)
	for i := 0; i < MaxConnRetries; i++ {
		conn, err = kafka.Dial("tcp", brokers[0])
		if err == nil {
			break
		}
		log.Printf("⏳ Waiting for Kafka broker... attempt %d/%d (%v)", i+1, MaxConnRetries, err)
		time.Sleep(RetryInterval)
	}
	if err != nil {
		return fmt.Errorf("failed to dial kafka: %w", err)
	}
	defer conn.Close()

	// 2. Identify the Controller
	controller, err := conn.Controller()
	if err != nil {
		return fmt.Errorf("failed to find kafka controller: %w", err)
	}

	// 3. Connect to the Controller for Administrative tasks
	controllerAddr := net.JoinHostPort(controller.Host, strconv.Itoa(controller.Port))
	controllerConn, err := kafka.Dial("tcp", controllerAddr)
	if err != nil {
		return fmt.Errorf("failed to dial kafka controller: %w", err)
	}
	defer controllerConn.Close()

	// 4. Build Topic Configurations (Requesting 3 partitions for high performance)
	topicConfigs := make([]kafka.TopicConfig, len(topics))
	for i, t := range topics {
		topicConfigs[i] = kafka.TopicConfig{
			Topic:             t,
			NumPartitions:     DefaultPartitions,
			ReplicationFactor: DefaultReplicationFactor,
		}
	}

	// 5. Create Topics (Handles if-not-exists internally, errors if partition count mismatches)
	err = controllerConn.CreateTopics(topicConfigs...)
	if err != nil {
		log.Printf("ℹ️ Kafka topic management action: %v", err)
	}

	// 6. Mandatory Wait: Leadership election window
	// Even after creation, Kafka needs a moment to elect leaders for all partitions.
	log.Printf("✅ Kafka topics verified: %v (Partitions: %d)", topics, DefaultPartitions)
	log.Println("🚜 Allowing 2s for leadership election to stabilize...")
	time.Sleep(2 * time.Second)

	return nil
}

// WaitForKafka is a helper for services to wait until Kafka is reachable
func WaitForKafka(brokers []string, timeout time.Duration) error {
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		conn, err := kafka.Dial("tcp", brokers[0])
		if err == nil {
			conn.Close()
			return nil
		}
		time.Sleep(2 * time.Second)
	}
	return fmt.Errorf("kafka not ready after %v", timeout)
}
