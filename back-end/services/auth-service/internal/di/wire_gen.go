//go:build !wireinject
// +build !wireinject

package di

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/api/handler"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/api/router"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/config"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/db"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/repository"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/service"
)

// Injectors from wire.go:

func Initialize(cfg config.PostgresConfig, redisCfg config.RedisConfig) (*gin.Engine, error) {
	gormDB, err := db.ConnectPostgres(cfg)
	if err != nil {
		return nil, err
	}
	userRepository := repository.NewUserRepository(gormDB)
	client, err := db.ConnectRedis(redisCfg)
	if err != nil {
		return nil, err
	}
	redisRepository := repository.NewRedisRepository(client)
	emailSender := ProvideEmailSender()
	secretKey := os.Getenv("SECRET_KEY")
	authService := service.NewAuthService(userRepository, redisRepository, emailSender, secretKey)
	authHandler := handler.NewAuthHandler(authService)
	engine := router.NewRouter(authHandler)
	return engine, nil
}
