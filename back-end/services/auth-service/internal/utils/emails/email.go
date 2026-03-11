package email

import (
	"bytes"
	"embed"
	"fmt"
	"html/template"

	"github.com/resend/resend-go/v3"
)

var templateFS embed.FS

type EmailSender struct {
	client *resend.Client
	from   string
}

func NewEmailSender(apiKey, fromEmail string) *EmailSender {
	return &EmailSender{
		client: resend.NewClient(apiKey),
		from:   fromEmail,
	}
}

func (s *EmailSender) SendOTP(toEmail, otp string) error {
	tmpl, err := template.ParseFS(templateFS, "templates/sendOTP.html")
	if err != nil {
		return fmt.Errorf("could not parse embedded template: %w", err)
	}

	data := struct {
		OTP string
	}{
		OTP: otp,
	}

	var body bytes.Buffer
	if err := tmpl.Execute(&body, data); err != nil {
		return fmt.Errorf("could not execute template: %w", err)
	}

	params := &resend.SendEmailRequest{
		From:    s.from,
		To:      []string{toEmail},
		Subject: fmt.Sprintf("%s is your KrishAI verification code", otp),
		Html:    body.String(),
	}

	sent, err := s.client.Emails.Send(params)
	if err != nil {
		return fmt.Errorf("resend api error: %w", err)
	}

	fmt.Printf("OTP Email sent to %s (ID: %s)\n", toEmail, sent.Id)
	return nil
}
