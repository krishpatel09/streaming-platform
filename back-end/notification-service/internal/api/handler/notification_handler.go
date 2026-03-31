package handler

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/notification-service/internal/model"
	"github.com/krishpatel09/streaming-platform/notification-service/internal/usecase"
)

type NotificationHandler struct {
	useCase usecase.NotificationUseCase
}

func NewNotificationHandler(useCase usecase.NotificationUseCase) *NotificationHandler {
	return &NotificationHandler{useCase: useCase}
}

func (h *NotificationHandler) HandleSSE(c *gin.Context) {
	videoID := c.Param("videoID")
	clientChan := make(model.Client)

	h.useCase.Register(videoID, clientChan)

	c.Stream(func(w io.Writer) bool {
		if msg, ok := <-clientChan; ok {
			c.SSEvent("message", msg)
			return true
		}
		return false
	})

	defer h.useCase.Unregister(videoID, clientChan)
}

func (h *NotificationHandler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "alive"})
}
