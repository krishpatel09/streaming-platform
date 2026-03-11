package di

import (
	"os"

	email "github.com/krishpatel09/streaming-platform/services/auth-service/internal/utils/emails"
)

func ProvideEmailSender() *email.EmailSender {
	apiKey := os.Getenv("RESEND_API_KEY")
	fromEmail := os.Getenv("EMAIL_FROM")
	return email.NewEmailSender(apiKey, fromEmail)
}
