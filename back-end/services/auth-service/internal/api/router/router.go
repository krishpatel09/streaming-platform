package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/api"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/api/handler"
)

func NewRouter(h *handler.AuthHandler) *gin.Engine {
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "UP",
			"service": "auth-service",
		})
	})

	auth := r.Group("/auth")
	{
		auth.POST("/register", h.Register)
		auth.POST("/login", h.Login)
	}
	protected := r.Group("/auth")
	protected.Use(api.AuthMiddleware())
	{
		protected.GET("/me", h.GetProfile)
	}

	return r
}
