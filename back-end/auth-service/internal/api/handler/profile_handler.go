package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/krishpatel09/streaming-platform/auth-service/internal/domain"
	"github.com/krishpatel09/streaming-platform/auth-service/internal/usecase"
	"github.com/krishpatel09/streaming-platform/auth-service/internal/utils/response"
)

type ProfileHandler struct {
	svc usecase.ProfileUseCase
}

func NewProfileHandler(svc usecase.ProfileUseCase) *ProfileHandler {
	return &ProfileHandler{svc: svc}
}

func (h *ProfileHandler) GetProfiles(c *gin.Context) {
	userIDStr := c.GetString("user_id") // Assuming middleware sets this
	userID, _ := uuid.Parse(userIDStr)

	profiles, err := h.svc.GetProfiles(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.GeneralError(err))
		return
	}

	c.JSON(http.StatusOK, response.NewResponse(http.StatusOK, "ok", profiles))
}

func (h *ProfileHandler) CreateProfile(c *gin.Context) {
	userIDStr := c.GetString("user_id")
	userID, _ := uuid.Parse(userIDStr)

	var profile domain.Profile
	if err := c.ShouldBindJSON(&profile); err != nil {
		c.JSON(http.StatusBadRequest, response.BadRequest(err.Error()))
		return
	}

	if err := h.svc.CreateProfile(userID, &profile); err != nil {
		c.JSON(http.StatusInternalServerError, response.GeneralError(err))
		return
	}

	c.JSON(http.StatusCreated, response.NewResponse(http.StatusCreated, "profile created", profile))
}

func (h *ProfileHandler) UpdateProfile(c *gin.Context) {
	userIDStr := c.GetString("user_id")
	userID, _ := uuid.Parse(userIDStr)

	idStr := c.Param("id")
	profileID, _ := uuid.Parse(idStr)

	var profile domain.Profile
	if err := c.ShouldBindJSON(&profile); err != nil {
		c.JSON(http.StatusBadRequest, response.BadRequest(err.Error()))
		return
	}
	profile.ID = profileID

	if err := h.svc.UpdateProfile(userID, &profile); err != nil {
		if r, ok := err.(response.Response); ok {
			c.JSON(r.StatusCode, r)
			return
		}
		c.JSON(http.StatusInternalServerError, response.GeneralError(err))
		return
	}

	c.JSON(http.StatusOK, response.NewResponse(http.StatusOK, "profile updated", nil))
}

func (h *ProfileHandler) DeleteProfile(c *gin.Context) {
	userIDStr := c.GetString("user_id")
	userID, _ := uuid.Parse(userIDStr)

	idStr := c.Param("id")
	profileID, _ := uuid.Parse(idStr)

	if err := h.svc.DeleteProfile(userID, profileID); err != nil {
		if r, ok := err.(response.Response); ok {
			c.JSON(r.StatusCode, r)
			return
		}
		c.JSON(http.StatusInternalServerError, response.GeneralError(err))
		return
	}

	c.JSON(http.StatusOK, response.NewResponse(http.StatusOK, "profile deleted", nil))
}

func (h *ProfileHandler) UpdatePreferences(c *gin.Context) {
	idStr := c.Param("id")
	profileID, _ := uuid.Parse(idStr)

	var prefs domain.UserPreference
	if err := c.ShouldBindJSON(&prefs); err != nil {
		c.JSON(http.StatusBadRequest, response.BadRequest(err.Error()))
		return
	}

	if err := h.svc.UpdatePreferences(profileID, &prefs); err != nil {
		c.JSON(http.StatusInternalServerError, response.GeneralError(err))
		return
	}

	c.JSON(http.StatusOK, response.NewResponse(http.StatusOK, "preferences updated", nil))
}
