package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/api/handler"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/api/middleware"
)

func NewRouter(h *handler.AuthHandler, uh *handler.UserHandler) *gin.Engine {
	r := gin.Default()

	// CORS Middleware
	r.Use(middleware.CORSMiddleware())

	r.GET("/health", func(c *gin.Context) {

		c.JSON(http.StatusOK, gin.H{
			"service": "auth-service",
			"status":  "Ok",
		})
	})

	apiV1 := r.Group("/api/v1")
	{
		auth := apiV1.Group("/auth")
		{
			auth.POST("/send-otp", h.SendOTP)
			auth.POST("/verify-otp", h.VerifyOTP)
			auth.POST("/refresh", h.RefreshToken)
			auth.POST("/logout", h.Logout)
		}
	}

	user := r.Group("/user")
	user.Use(middleware.AuthMiddleware())
	{
		user.GET("/api/profile", uh.GetProfile)
	}

	return r
}
