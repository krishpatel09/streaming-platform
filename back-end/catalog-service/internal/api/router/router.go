package router

import (
	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/catalog-service/internal/api/handler"
)

func Register(r *gin.Engine, h *handler.CatalogHandler) {
	api := r.Group("/api")
	{
		catalog := api.Group("/catalog")
		{
			catalog.POST("/videos", h.CreateVideo)
			catalog.GET("/content", h.GetAllContent)
			catalog.GET("/content/:id", h.GetByID)
			catalog.GET("/search", h.Search)
		}
	}
}
