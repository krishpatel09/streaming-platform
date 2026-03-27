package router

import (
	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/streaming-service/internal/api/handler"
)

func Register(r *gin.Engine, h *handler.StreamingHandler) {
	api := r.Group("/api")
	{
		streaming := api.Group("/streaming")
		{
			streaming.POST("/upload-url", h.GetUploadURL)
		}
	}
}
