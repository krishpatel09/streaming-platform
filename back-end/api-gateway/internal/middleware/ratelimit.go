package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/api-gateway/config"
)

type limiter struct {
	tokens    float64
	maxTokens float64
	refillRate float64
	lastRefill time.Time
	mu         sync.Mutex
}

var limiters sync.Map

func RateLimit(cfg *config.Config) gin.HandlerFunc {
	max := float64(cfg.RateLimit)
	return func(c *gin.Context) {
		key := c.ClientIP()
		val, _ := limiters.LoadOrStore(key, &limiter{
			tokens:     max,
			maxTokens:  max,
			refillRate: max / 60.0, // per second
			lastRefill: time.Now(),
		})
		l := val.(*limiter)
		l.mu.Lock()
		defer l.mu.Unlock()

		now := time.Now()
		elapsed := now.Sub(l.lastRefill).Seconds()
		l.tokens = min(l.maxTokens, l.tokens+elapsed*l.refillRate)
		l.lastRefill = now

		if l.tokens < 1 {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{"error": "rate limit exceeded"})
			return
		}
		l.tokens--
		c.Next()
	}
}

func min(a, b float64) float64 {
	if a < b {
		return a
	}
	return b
}
