package usecase

import (
	"context"
	"encoding/json"
	"log"
	"sync"

	"github.com/krishpatel09/streaming-platform/notification-service/internal/model"
	"github.com/krishpatel09/streaming-platform/notification-service/internal/repository"
	"github.com/krishpatel09/streaming-platform/shared/pkg/kafka"
)

type NotificationUseCase interface {
	Run(ctx context.Context)
	Register(videoID string, client model.Client)
	Unregister(videoID string, client model.Client)
}

type notificationUseCase struct {
	repo     repository.NotificationRepository
	consumer kafka.Consumer
	clients  map[string]map[model.Client]bool
	mutex    sync.Mutex
}

func NewNotificationUseCase(repo repository.NotificationRepository, consumer kafka.Consumer) NotificationUseCase {
	return &notificationUseCase{
		repo:     repo,
		consumer: consumer,
		clients:  make(map[string]map[model.Client]bool),
	}
}

func (u *notificationUseCase) Run(ctx context.Context) {
	log.Println("📡 Notification Worker started...")
	for {
		msg, err := u.consumer.ReadMessage(ctx)
		if err != nil {
			log.Printf("error reading kafka message: %v", err)
			continue
		}

		log.Printf("📥 Received Kafka Message on topic %s: %s", msg.Topic, string(msg.Value))

		var event model.TranscodingEvent
		if err := json.Unmarshal(msg.Value, &event); err != nil {
			log.Printf("❌ Failed to unmarshal transcoding event: %v", err)
			continue
		}

		// 1. Persist to MongoDB
		notification := &model.Notification{
			VideoID: event.VideoID,
			Message: "Transcoding completed successfully",
			Status:  event.Status,
		}
		if err := u.repo.Save(ctx, notification); err != nil {
			log.Printf("failed to save notification: %v", err)
		}

		// 2. Broadcast to connected SSE clients
		u.broadcast(event.VideoID, "completed")
	}
}

func (u *notificationUseCase) Register(videoID string, client model.Client) {
	u.mutex.Lock()
	defer u.mutex.Unlock()
	if _, ok := u.clients[videoID]; !ok {
		u.clients[videoID] = make(map[model.Client]bool)
	}
	u.clients[videoID][client] = true
	log.Printf("👤 Client connected for video: %s", videoID)
}

func (u *notificationUseCase) Unregister(videoID string, client model.Client) {
	u.mutex.Lock()
	defer u.mutex.Unlock()
	if clients, ok := u.clients[videoID]; ok {
		if _, ok := clients[client]; ok {
			delete(clients, client)
			close(client)
			if len(clients) == 0 {
				delete(u.clients, videoID)
			}
		}
	}
	log.Printf("👤 Client disconnected for video: %s", videoID)
}

func (u *notificationUseCase) broadcast(videoID string, message string) {
	u.mutex.Lock()
	defer u.mutex.Unlock()
	if clients, ok := u.clients[videoID]; ok {
		for client := range clients {
			select {
			case client <- message:
			default:
				close(client)
				delete(clients, client)
			}
		}
	}
}
