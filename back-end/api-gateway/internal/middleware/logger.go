package middleware

import (
	"log/slog"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		reqID := uuid.New().String()
		c.Set("requestID", reqID)
		c.Header("X-Request-ID", reqID)

		c.Next()

		slog.Info("request",
			"method", c.Request.Method,
			"path", c.Request.URL.Path,
			"status", c.Writer.Status(),
			"latency_ms", time.Since(start).Milliseconds(),
			"request_id", reqID,
			"ip", c.ClientIP(),
		)
	}
}
