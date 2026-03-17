package response

import (
	"encoding/json"
	"net/http"
)

type Response struct {
	StatusCode int    `json:"-"`
	Success    bool   `json:"success"`
	Message    string `json:"message"`
	Data       any    `json:"data,omitempty"`
}

func (r Response) Error() string {
	return r.Message
}

func WriteJson(w http.ResponseWriter, status int, message string, data any) error {
	w.Header().Set("Content-type", "application/json")
	w.WriteHeader(status)

	return json.NewEncoder(w).Encode(Response{
		StatusCode: status,
		Success:    status >= 200 && status < 300,
		Message:    message,
		Data:       data,
	})
}

func NewResponse(statusCode int, message string, data any) Response {
	return Response{
		StatusCode: statusCode,
		Success:    statusCode >= 200 && statusCode < 300,
		Message:    message,
		Data:       data,
	}
}

func GeneralError(err error) Response {
	return Response{
		StatusCode: http.StatusInternalServerError,
		Success:    false,
		Message:    err.Error(),
	}
}

func EmailAlreadyExists() Response {
	return Response{
		StatusCode: http.StatusConflict,
		Success:    false,
		Message:    "email already exists",
	}
}

func Unauthorized(message string) Response {
	return Response{
		StatusCode: http.StatusUnauthorized,
		Success:    false,
		Message:    message,
	}
}

func BadRequest(message string) Response {
	return Response{
		StatusCode: http.StatusBadRequest,
		Success:    false,
		Message:    message,
	}
}
