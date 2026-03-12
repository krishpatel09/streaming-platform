package response

import (
	"encoding/json"
	"net/http"
)

type Response struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
}

func (r Response) Error() string {
	return r.Message
}

func WriteJson(w http.ResponseWriter, status int, message string, data any) error {
	w.Header().Set("Content-type", "application/json")
	w.WriteHeader(status)

	return json.NewEncoder(w).Encode(Response{
		Status:  status,
		Message: message,
		Data:    data,
	})
}

func NewResponse(status int, message string, data any) Response {
	return Response{
		Status:  status,
		Message: message,
		Data:    data,
	}
}

func GeneralError(err error) Response {
	return Response{
		Status:  http.StatusInternalServerError,
		Message: err.Error(),
	}
}

func EmailAlreadyExists() Response {
	return Response{
		Status:  http.StatusConflict,
		Message: "email already exists",
	}
}

func Unauthorized(message string) Response {
	return Response{
		Status:  http.StatusUnauthorized,
		Message: message,
	}
}

func BadRequest(message string) Response {
	return Response{
		Status:  http.StatusBadRequest,
		Message: message,
	}
}
