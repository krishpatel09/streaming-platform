package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/krishpatel09/streaming-platform/auth-service/internal/domain"
	"github.com/krishpatel09/streaming-platform/auth-service/internal/usecase"
	"github.com/krishpatel09/streaming-platform/auth-service/internal/utils/response"
)

type AuthHandler struct {
	svc usecase.AuthUseCase
}

func NewAuthHandler(svc usecase.AuthUseCase) *AuthHandler {
	return &AuthHandler{svc: svc}
}

func (h *AuthHandler) SendOTP(c *gin.Context) {
	var req domain.SendOTPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.BadRequest(err.Error()))
		return
	}

	err := h.svc.SendOTP(req)
	if err != nil {
		if r, ok := err.(response.Response); ok {
			c.JSON(r.StatusCode, r)
			return
		}
		c.JSON(http.StatusInternalServerError, response.GeneralError(err))
		return
	}

	c.JSON(http.StatusOK, response.NewResponse(http.StatusOK, "otp sent successfully", nil))
}

func (h *AuthHandler) VerifyOTP(c *gin.Context) {
	var req domain.VerifyOTPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.BadRequest(err.Error()))
		return
	}

	res, err := h.svc.VerifyOTP(req)
	if err != nil {
		if r, ok := err.(response.Response); ok {
			c.JSON(r.StatusCode, r)
			return
		}
		c.JSON(http.StatusInternalServerError, response.GeneralError(err))
		return
	}

	c.JSON(http.StatusOK, response.NewResponse(http.StatusOK, "otp verified successfully", res))
}

func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var req domain.RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.BadRequest("missing or invalid refresh token in body"))
		return
	}

	res, err := h.svc.RefreshToken(req)
	if err != nil {
		if r, ok := err.(response.Response); ok {
			c.JSON(r.StatusCode, r)
			return
		}
		c.JSON(http.StatusUnauthorized, response.Unauthorized(err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.NewResponse(http.StatusOK, "token refreshed successfully", res))
}

func (h *AuthHandler) Logout(c *gin.Context) {
	var req struct {
		RefreshToken string `json:"refreshToken" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.BadRequest("missing or invalid refresh token in body"))
		return
	}

	if err := h.svc.Logout(req.RefreshToken); err != nil {
		c.JSON(http.StatusInternalServerError, response.GeneralError(err))
		return
	}

	c.JSON(http.StatusOK, response.NewResponse(http.StatusOK, "logged out successfully", nil))
}

func (h *AuthHandler) GetSessions(c *gin.Context) {
	userIDStr := c.GetString("user_id")
	userID, _ := uuid.Parse(userIDStr)

	sessions, err := h.svc.GetSessions(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.GeneralError(err))
		return
	}

	c.JSON(http.StatusOK, response.NewResponse(http.StatusOK, "ok", sessions))
}

func (h *AuthHandler) RevokeSession(c *gin.Context) {
	userIDStr := c.GetString("user_id")
	userID, _ := uuid.Parse(userIDStr)

	sessionIDStr := c.Param("id")
	sessionID, _ := uuid.Parse(sessionIDStr)

	if err := h.svc.RevokeSession(userID, sessionID); err != nil {
		if r, ok := err.(response.Response); ok {
			c.JSON(r.StatusCode, r)
			return
		}
		c.JSON(http.StatusInternalServerError, response.GeneralError(err))
		return
	}

	c.JSON(http.StatusOK, response.NewResponse(http.StatusOK, "session revoked", nil))
}
