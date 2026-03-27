package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/krishpatel09/streaming-platform/api-gateway/config"
)

type Claims struct {
	UserID string `json:"user_id"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// Public routes that skip JWT validation
var publicRoutes = map[string]bool{
	"/api/auth/login":           true,
	"/api/auth/register":        true,
	"/api/auth/refresh":         true,
	"/api/auth/otp/send":        true,
	"/api/auth/otp/verify":      true,
	"/api/auth/password/forgot": true,
	"/api/payment/webhook":      true,
	"/health":                   true,
}

func Auth(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		if publicRoutes[c.FullPath()] {
			c.Next()
			return
		}

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "authorization header required"})
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid authorization format"})
			return
		}

		token, err := jwt.ParseWithClaims(parts[1], &Claims{}, func(t *jwt.Token) (interface{}, error) {
			return []byte(cfg.JWTSecret), nil
		})
		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
			return
		}

		claims, ok := token.Claims.(*Claims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token claims"})
			return
		}

		// Inject user context for downstream services
		c.Request.Header.Set("X-User-ID", claims.UserID)
		c.Request.Header.Set("X-User-Role", claims.Role)
		c.Set("userID", claims.UserID)
		c.Set("userRole", claims.Role)

		c.Next()
	}
}
