package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/auth-service/internal/api/handler"
	"github.com/krishpatel09/streaming-platform/auth-service/internal/api/middleware"
)

func NewRouter(h *handler.AuthHandler, uh *handler.UserHandler, ph *handler.ProfileHandler) *gin.Engine {
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

			// Session Management (Device Mgmt)
			auth.GET("/sessions", middleware.AuthMiddleware(), h.GetSessions)
			auth.DELETE("/sessions/:id", middleware.AuthMiddleware(), h.RevokeSession)
		}

		// Profile Routes
		profiles := apiV1.Group("/profiles")
		profiles.Use(middleware.AuthMiddleware())
		{
			profiles.GET("", ph.GetProfiles)
			profiles.POST("", ph.CreateProfile)
			profiles.PATCH("/:id", ph.UpdateProfile)
			profiles.DELETE("/:id", ph.DeleteProfile)
			profiles.PATCH("/:id/preferences", ph.UpdatePreferences)
		}
	}

	user_group := r.Group("/user")
	user_group.Use(middleware.AuthMiddleware())
	{
		user_group.GET("/api/profile", uh.GetProfile)
	}

	return r
}
