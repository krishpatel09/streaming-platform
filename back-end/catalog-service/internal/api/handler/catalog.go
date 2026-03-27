package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/catalog-service/internal/usecase"
)

type CatalogHandler struct {
	useCase usecase.CatalogUseCase
}

func NewCatalogHandler(u usecase.CatalogUseCase) *CatalogHandler {
	return &CatalogHandler{useCase: u}
}

type CreateVideoRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
}

func (h *CatalogHandler) CreateVideo(c *gin.Context) {
	var req CreateVideoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	video, err := h.useCase.CreateVideoRecord(c.Request.Context(), req.Title, req.Description)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create video record"})
		return
	}

	c.JSON(http.StatusCreated, video)
}

func (h *CatalogHandler) GetAllContent(c *gin.Context) {
	results, err := h.useCase.GetAllContent(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch content"})
		return
	}

	c.JSON(http.StatusOK, results)
}

func (h *CatalogHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	result, err := h.useCase.GetContentByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "content not found"})
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *CatalogHandler) Search(c *gin.Context) {
	query := c.Query("q")
	results, err := h.useCase.SearchContent(c.Request.Context(), query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to search content"})
		return
	}

	c.JSON(http.StatusOK, results)
}

