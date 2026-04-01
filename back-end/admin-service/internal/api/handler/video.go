package handler

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/admin-service/internal/usecase"
	"github.com/krishpatel09/streaming-platform/shared/pkg/kafka"
	"github.com/krishpatel09/streaming-platform/shared/pkg/storage"
	"go.mongodb.org/mongo-driver/bson"
)

type VideoHandler struct {
	useCase  usecase.VideoUseCase
	storage  storage.Storage // Skeleton for now
	producer kafka.Producer  // Skeleton for now
}

func NewVideoHandler(uc usecase.VideoUseCase, s storage.Storage, p kafka.Producer) *VideoHandler {
	return &VideoHandler{useCase: uc, storage: s, producer: p}
}

type UploadVideoRequest struct {
	VideoID     string `json:"video_id" binding:"required"`
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	StoragePath string `json:"storage_path" binding:"required"`
}

func (h *VideoHandler) UploadVideo(c *gin.Context) {
	var req UploadVideoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.useCase.NotifyUploadComplete(c.Request.Context(), req.VideoID, req.Title, req.Description, req.StoragePath)
	if err != nil {
		log.Printf("Error notifying upload completion: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to notify upload completion", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "upload notification received, processing started"})
}

func (h *VideoHandler) AddContent(c *gin.Context) {
	var content bson.M
	if err := c.ShouldBindJSON(&content); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id, err := h.useCase.AddContent(c.Request.Context(), content)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add content"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": id})
}

func (h *VideoHandler) GetAllContent(c *gin.Context) {
	results, err := h.useCase.GetAllContent(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch content"})
		return
	}
	c.JSON(http.StatusOK, results)
}

func (h *VideoHandler) GetContentByID(c *gin.Context) {
	id := c.Param("id")
	result, err := h.useCase.GetContentByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "content not found"})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *VideoHandler) UpdateContent(c *gin.Context) {
	id := c.Param("id")
	var data bson.M
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.useCase.UpdateContent(c.Request.Context(), id, data)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update content"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "updated"})
}

func (h *VideoHandler) DeleteContent(c *gin.Context) {
	id := c.Param("id")
	err := h.useCase.DeleteContent(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete content"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}
