package handler

import (
	"encoding/json"
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

func (h *AuthHandler) Register(c *gin.Context) {
	var req domain.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.BadRequest(err.Error()))
		return
	}

	res, err := h.svc.Register(req)
	if err != nil {
		if r, ok := err.(response.Response); ok {
			c.JSON(r.StatusCode, r)
			return
		}
		c.JSON(http.StatusInternalServerError, response.GeneralError(err))
		return
	}

	c.JSON(http.StatusCreated, response.NewResponse(http.StatusCreated, "user registered successfully. please verify otp", res))
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req domain.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.BadRequest(err.Error()))
		return
	}
	deviceInfoBytes, _ := json.Marshal(map[string]string{"userAgent": c.Request.UserAgent()})
	req.DeviceInfo = string(deviceInfoBytes)

	ip := c.ClientIP()
	if ip == "" {
		ip = "127.0.0.1"
	}
	req.IPAddress = ip

	res, err := h.svc.Login(req)
	if err != nil {
		if r, ok := err.(response.Response); ok {
			c.JSON(r.StatusCode, r)
			return
		}
		c.JSON(http.StatusUnauthorized, response.Unauthorized(err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.NewResponse(http.StatusOK, "Login successful", res))
}

func (h *AuthHandler) VerifyOTP(c *gin.Context) {
	var req domain.VerifyOTPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.BadRequest(err.Error()))
		return
	}
	deviceInfoBytes, _ := json.Marshal(map[string]string{"userAgent": c.Request.UserAgent()})
	req.DeviceInfo = string(deviceInfoBytes)

	ip := c.ClientIP()
	if ip == "" {
		ip = "127.0.0.1"
	}
	req.IPAddress = ip

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

func (h *AuthHandler) ResendOTP(c *gin.Context) {
	var req domain.ResendOTPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.BadRequest(err.Error()))
		return
	}

	res, err := h.svc.ResendOTP(req)
	if err != nil {
		if r, ok := err.(response.Response); ok {
			c.JSON(r.StatusCode, r)
			return
		}
		c.JSON(http.StatusInternalServerError, response.GeneralError(err))
		return
	}

	c.JSON(http.StatusOK, response.NewResponse(http.StatusOK, "otp resent successfully", res))
}

func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var req domain.RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.BadRequest(err.Error()))
		return
	}
	deviceInfoBytes, _ := json.Marshal(map[string]string{"userAgent": c.Request.UserAgent()})
	req.DeviceInfo = string(deviceInfoBytes)

	ip := c.ClientIP()
	if ip == "" {
		ip = "127.0.0.1"
	}
	req.IPAddress = ip

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
	var req domain.RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, response.BadRequest(err.Error()))
		return
	}

	if err := h.svc.Logout(req.RefreshToken); err != nil {
		c.JSON(http.StatusInternalServerError, response.GeneralError(err))
		return
	}

	c.JSON(http.StatusOK, response.NewResponse(http.StatusOK, "logged out successfully", nil))
}
