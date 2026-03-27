package router

import (
	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/api-gateway/config"
	"github.com/krishpatel09/streaming-platform/api-gateway/internal/middleware"
	"github.com/krishpatel09/streaming-platform/api-gateway/internal/proxy"
)

func Register(cfg *config.Config) *gin.Engine {
	r := gin.New()

	// Global Middleware
	r.Use(middleware.Logger())
	r.Use(middleware.Recovery())
	r.Use(middleware.CORS(cfg))

	// Proxy Definitions
	authProxy := proxy.NewProxy(cfg.Services.Auth)
	catalogProxy := proxy.NewProxy(cfg.Services.Catalog)
	streamingProxy := proxy.NewProxy(cfg.Services.Streaming)

	// Public API Group (No Auth required)
	r.Any("/api/auth/*any", authProxy.Handler())
	r.Any("/api/catalog/*any", catalogProxy.Handler())
	r.Any("/api/streaming/*any", streamingProxy.Handler())
	r.Any("/api/common/*any", authProxy.Handler())

	// Protected API Group (JWT Auth required)
	authorized := r.Group("/api")
	authorized.Use(middleware.Auth(cfg))
	{
		authorized.Any("/admin/*any", proxy.NewProxy(cfg.Services.Admin).Handler())
		authorized.Any("/user/*any", proxy.NewProxy(cfg.Services.User).Handler())
		authorized.Any("/profiles", authProxy.Handler())
		authorized.Any("/profiles/*any", authProxy.Handler())
	}

	return r
}
