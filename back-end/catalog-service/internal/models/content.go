package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MediaType string

const (
	MediaTypeMovie MediaType = "movie"
	MediaTypeShow  MediaType = "show"
	MediaTypeShort MediaType = "short"
	MediaTypeSport MediaType = "sport"
	MediaTypeLive  MediaType = "live"
)

type LocalizedTitle struct {
	Default   string            `bson:"default" json:"default"`
	Localized map[string]string `bson:"localized,omitempty" json:"localized,omitempty"`
}

type CastMember struct {
	PersonID  string `bson:"person_id" json:"person_id"` // could be primitive.ObjectI
	Name      string `bson:"name" json:"name"`
	Role      string `bson:"role" json:"role"` // actor|director
	Character string `bson:"character" json:"character"`
}

type Season struct {
	SeasonNumber int    `bson:"season_number" json:"season_number"`
	Title        string `bson:"title" json:"title"`
	EpisodeCount int    `bson:"episode_count" json:"episode_count"`
	Year         int    `bson:"year" json:"year"`
}

type LiveInfo struct {
	IsLive       bool       `bson:"is_live" json:"is_live"`
	StartTime    *time.Time `bson:"start_time" json:"start_time"`
	EndTime      *time.Time `bson:"end_time" json:"end_time"`
	StreamStatus string     `bson:"stream_status" json:"stream_status"` // upcoming | live | ended
}

type StreamingInfo struct {
	HLSMasterURL       string   `bson:"hls_master_url" json:"hls_master_url"`
	DRMKeyID           string   `bson:"drm_key_id" json:"drm_key_id"`
	AvailableQualities []string `bson:"available_qualities" json:"available_qualities"`
	HasDolbyAtmos      bool     `bson:"has_dolby_atmos" json:"has_dolby_atmos"`
	HasHDR             bool     `bson:"has_hdr" json:"has_hdr"`
}

type Availability struct {
	PlanRequired   string     `bson:"plan_required" json:"plan_required"` // basic | premium | free
	AvailableFrom  *time.Time `bson:"available_from" json:"available_from"`
	AvailableUntil *time.Time `bson:"available_until" json:"available_until"`
}

type Stats struct {
	Views       int     `bson:"views" json:"views"`
	AvgRating   float64 `bson:"avg_rating" json:"avg_rating"`
	RatingCount int     `bson:"rating_count" json:"rating_count"`
}

type Content struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Slug            string             `bson:"slug" json:"slug"`
	Status          string             `bson:"status" json:"status"` // processing | published | failed
	Type            MediaType          `bson:"type" json:"type"`
	Title           LocalizedTitle     `bson:"title" json:"title"`
	Description     string             `bson:"description" json:"description"`
	Genres          []string           `bson:"genres" json:"genres"`
	Languages       []string           `bson:"languages" json:"languages"`
	ReleaseDate     *time.Time         `bson:"release_date" json:"release_date"`
	AgeRating       string             `bson:"age_rating" json:"age_rating"`
	DurationMinutes int                `bson:"duration_minutes" json:"duration_minutes"`

	// Movie Specific
	PosterURL  string `bson:"poster_url" json:"poster_url"`
	BannerURL  string `bson:"banner_url" json:"banner_url"`
	TrailerURL string `bson:"trailer_url" json:"trailer_url"`

	Tags []string     `bson:"tags" json:"tags"`
	Cast []CastMember `bson:"cast" json:"cast"`

	// Show Specific
	Seasons []Season `bson:"seasons,omitempty" json:"seasons,omitempty"`

	Streaming    StreamingInfo `bson:"streaming" json:"streaming"`
	Live         LiveInfo      `bson:"live,omitempty" json:"live,omitempty"`
	Availability Availability  `bson:"availability" json:"availability"`
	Stats        Stats         `bson:"stats" json:"stats"`

	IsPublished bool       `bson:"is_published" json:"is_published"`
	CreatedAt   *time.Time `bson:"created_at" json:"created_at"`
	UpdatedAt   *time.Time `bson:"updated_at" json:"updated_at"`
}
