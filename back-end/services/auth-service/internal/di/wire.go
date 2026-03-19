//go:build wireinject
// +build wireinject

package di

import (
	"github.com/gin-gonic/gin"
	"github.com/google/wire"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/api/handler"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/api/router"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/config"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/db"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/repository"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/usecase"
)

func Initialize(cfg config.PostgresConfig, redisCfg config.RedisConfig) (*gin.Engine, error) {
	wire.Build(
		db.ConnectPostgres,
		db.ConnectRedis,
		repository.NewUserRepository,
		repository.NewOTPRepository,
		repository.NewRedisRepository,
		repository.NewRefreshTokenRepository,
		ProvideEmailSender,
		ProvideSMSSender,
		ProvideSecretKey,
		usecase.NewAuthUseCase,
		usecase.NewUserUseCase,
		handler.NewAuthHandler,
		handler.NewUserHandler,
		router.NewRouter,
	)

	return &gin.Engine{}, nil
}
