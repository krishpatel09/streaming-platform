package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/api/handler"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/api/middleware"
)

func NewRouter(h *handler.AuthHandler, uh *handler.UserHandler) *gin.Engine {
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
		auth.POST("/api/refresh-token", h.RefreshToken)
		auth.POST("/api/logout", h.Logout)
	}

	user := r.Group("/user")
	user.Use(middleware.AuthMiddleware())
	{
		user.GET("/api/profile", uh.GetProfile)
		user.GET("/api/preference", uh.GetPreference)
		user.PUT("/api/preference", uh.UpdatePreference)
	}

	return r
}
