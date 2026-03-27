package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/api-gateway/config"
)

func CORS(cfg *config.Config) gin.HandlerFunc {
	allowedSet := make(map[string]bool)
	for _, o := range cfg.AllowedOrigins {
		allowedSet[o] = true
	}

	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if allowedSet[origin] || cfg.Env != "production" {
			c.Header("Access-Control-Allow-Origin", origin)
		}
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Request-ID")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Header("Access-Control-Max-Age", "86400")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}
