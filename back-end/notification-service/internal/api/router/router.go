package router

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/notification-service/internal/api/handler"
)

func RegisterRoutes(r *gin.Engine, h *handler.NotificationHandler) {
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/health", h.HealthCheck)
	r.GET("/api/notifications/events/:videoID", h.HandleSSE)
}
