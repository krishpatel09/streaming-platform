package handler

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/shared/pkg/storage"
)

type StreamingHandler struct {
	storage storage.Storage
}

func NewStreamingHandler(s storage.Storage) *StreamingHandler {
	return &StreamingHandler{storage: s}
}

type UploadURLRequest struct {
	VideoID string `json:"video_id" binding:"required"`
	Type    string `json:"type"` // e.g., "trailer" or "source"
}

func (h *StreamingHandler) GetUploadURL(c *gin.Context) {
	var req UploadURLRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	suffix := ""
	ext := ".mp4"

	switch req.Type {
	case "trailer":
		suffix = "_trailer"
	case "poster":
		suffix = "_poster"
		ext = ".jpg"
	case "banner":
		suffix = "_banner"
		ext = ".jpg"
	}

	objectName := "raw/" + req.VideoID + suffix + ext
	url, err := h.storage.GetPresignedURL(c.Request.Context(), "videos", objectName, 15*time.Minute)
	if err != nil {
		log.Printf("Error generating presigned URL: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate upload URL", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"upload_url":   url,
		"storage_path": objectName,
	})
}
