package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Subtitle struct {
	Language string `bson:"language" json:"language"`
	URL      string `bson:"url" json:"url"`
	Format   string `bson:"format" json:"format"` // vtt | srt
}

type Episode struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ShowID          primitive.ObjectID `bson:"show_id" json:"show_id"` // Foreign Key to Content._id
	SeasonNumber    int                `bson:"season_number" json:"season_number"`
	EpisodeNumber   int                `bson:"episode_number" json:"episode_number"`
	Title           string             `bson:"title" json:"title"`
	Description     string             `bson:"description" json:"description"`
	DurationMinutes int                `bson:"duration_minutes" json:"duration_minutes"`
	ThumbnailURL    string             `bson:"thumbnail_url" json:"thumbnail_url"`
	Streaming       StreamingInfo      `bson:"streaming" json:"streaming"`
	Subtitles       []Subtitle         `bson:"subtitles,omitempty" json:"subtitles,omitempty"`
	AirDate         time.Time          `bson:"air_date" json:"air_date"`
	IsPublished     bool               `bson:"is_published" json:"is_published"`
	CreatedAt       time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt       time.Time          `bson:"updated_at" json:"updated_at"`
}
