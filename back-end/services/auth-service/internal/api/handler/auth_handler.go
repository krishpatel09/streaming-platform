package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/domain"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/usecase"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/utils/response"
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
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" || len(authHeader) < 8 || authHeader[:7] != "Bearer " {
		c.JSON(http.StatusUnauthorized, response.Unauthorized("missing or invalid authorization header"))
		return
	}
	refreshToken := authHeader[7:]

	res, err := h.svc.RefreshToken(domain.RefreshTokenRequest{
		RefreshToken: refreshToken,
	})
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
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" || len(authHeader) < 8 || authHeader[:7] != "Bearer " {
		c.JSON(http.StatusUnauthorized, response.Unauthorized("missing or invalid authorization header"))
		return
	}
	token := authHeader[7:]

	// Note: In a real app, if this is an access token,
	// we'd parse it to get the session_id/refresh_token_id.
	// For now, assuming the client sends the refresh token to logout or we handle it via claims.
	if err := h.svc.Logout(token); err != nil {
		c.JSON(http.StatusInternalServerError, response.GeneralError(err))
		return
	}

	c.JSON(http.StatusOK, response.NewResponse(http.StatusOK, "logged out successfully", nil))
}
