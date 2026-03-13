package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/domain"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/usecase"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/utils/response"
)

type UserHandler struct {
	svc usecase.UserUseCase
}

func NewUserHandler(svc usecase.UserUseCase) *UserHandler {
	return &UserHandler{svc: svc}
}

func (h *UserHandler) GetProfile(c *gin.Context) {
	userIDStr := c.GetString("user_id")
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user id"})
		return
	}

	res, err := h.svc.GetProfile(userID)
	if err != nil {
		if r, ok := err.(response.Response); ok {
			c.JSON(r.Status, r)
			return
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (h *UserHandler) GetPreference(c *gin.Context) {
	profileIDStr := c.Query("profile_id")
	profileID, err := uuid.Parse(profileIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid profile id"})
		return
	}

	res, err := h.svc.GetPreference(profileID)
	if err != nil {
		if r, ok := err.(response.Response); ok {
			c.JSON(r.Status, r)
			return
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "preferences not found"})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (h *UserHandler) UpdatePreference(c *gin.Context) {
	profileIDStr := c.Query("profile_id")
	profileID, err := uuid.Parse(profileIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid profile id"})
		return
	}

	var req domain.UserPreferenceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := h.svc.UpdatePreference(profileID, req)
	if err != nil {
		if r, ok := err.(response.Response); ok {
			c.JSON(r.Status, r)
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}
