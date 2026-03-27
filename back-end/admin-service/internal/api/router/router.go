package router

import (
	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/admin-service/internal/api/handler"
)

func RegisterRoutes(r *gin.Engine, h *handler.VideoHandler) {
	apiV1 := r.Group("/api")
	{
		admin := apiV1.Group("/admin")
		{
			admin.POST("/upload", h.UploadVideo)
			admin.POST("/content", h.AddContent)
			admin.PUT("/content/:id", h.UpdateContent)
			admin.DELETE("/content/:id", h.DeleteContent)
		}
	}
}
