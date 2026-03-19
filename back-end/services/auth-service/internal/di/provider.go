package di

import (
	"fmt"
	"os"

	email "github.com/krishpatel09/streaming-platform/services/auth-service/internal/utils/emails"
	sms "github.com/krishpatel09/streaming-platform/services/auth-service/internal/utils/phone_number"
)

func ProvideEmailSender() *email.EmailSender {
	apiKey := os.Getenv("RESEND_API_KEY")
	fromEmail := os.Getenv("EMAIL_FROM")

	if apiKey == "" {
		fmt.Println("RESEND_API_KEY is not set in environment variables")
	}

	if fromEmail == "" {
		fromEmail = "onboarding@resend.dev"
		fmt.Printf("EMAIL_FROM is not set, defaulting to %s\n", fromEmail)
	}

	return email.NewEmailSender(apiKey, fromEmail)
}

func ProvideSMSSender() *sms.SMSSender {
	apiKey := os.Getenv("FAST2SMS_API_KEY")
	if apiKey == "" {
		fmt.Println("FAST2SMS_API_KEY is not set in environment variables")
	}
	return sms.NewSMSSender(apiKey)
}

func ProvideSecretKey() string {
	return os.Getenv("SECRET_KEY")
}
