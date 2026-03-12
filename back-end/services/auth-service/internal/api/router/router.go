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
			"service": "auth-service",
			"status":  "Ok",
		})
	})

	auth := r.Group("/auth")
	{
		auth.POST("/api/register", h.Register)
		auth.POST("/api/login", h.Login)
		auth.POST("/api/verify-otp", h.VerifyOTP)
		auth.POST("/api/resend-otp", h.ResendOTP)
	}
	protected := r.Group("/auth")
	protected.Use(api.AuthMiddleware())
	{
		protected.GET("/me", h.GetProfile)
	}

	return r
}
