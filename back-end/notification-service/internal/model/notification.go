package model

import (
	"time"
)

// Client represents a connected frontend via SSE (Server-Sent Events)
type Client chan string

// Notification represents the persistent record of a transcoding event
type Notification struct {
	ID        string    `bson:"_id,omitempty" json:"id"`
	VideoID   string    `bson:"video_id" json:"video_id"`
	Message   string    `bson:"message" json:"message"`
	Status    string    `bson:"status" json:"status"`
	CreatedAt time.Time `bson:"created_at" json:"created_at"`
}

// TranscodingEvent describes the structure of the incoming Kafka message
type TranscodingEvent struct {
	VideoID string `json:"video_id"`
	Status  string `json:"status"`
}
