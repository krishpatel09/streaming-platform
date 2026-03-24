package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/krishpatel09/streaming-platform/auth-service/internal/usecase"
	"github.com/krishpatel09/streaming-platform/auth-service/internal/utils/response"
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
		c.JSON(http.StatusUnauthorized, response.Unauthorized("invalid user id"))
		return
	}

	res, err := h.svc.GetProfile(userID)
	if err != nil {
		if r, ok := err.(response.Response); ok {
			c.JSON(r.StatusCode, r)
			return
		}
		c.JSON(http.StatusNotFound, response.NewResponse(http.StatusNotFound, "user not found", nil))
		return
	}

	c.JSON(http.StatusOK, response.NewResponse(http.StatusOK, "user profile fetched successfully", res))
}
