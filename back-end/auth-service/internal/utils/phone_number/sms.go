package phonenumber

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
)

type SMSSender struct {
	apiKey string
}

func NewSMSSender(apiKey string) *SMSSender {
	return &SMSSender{apiKey: apiKey}
}

func (s *SMSSender) SendOTP(phoneNumber string, otp string) error {
	// Debug print for local testing (so you can see the OTP without SMS)
	fmt.Printf("\n[SMS DEBUG] OTP for %s is: %s\n", phoneNumber, otp)

	// Fast2SMS OTP route
	// https://www.fast2sms.com/dev/bulkV2?authorization=YOUR_API_KEY&variables_values=123456&route=otp&numbers=9999999999
	messageText := fmt.Sprintf("Your streaming app verification code is: %s", otp)
	encodedMessage := url.QueryEscape(messageText)

	apiURL := fmt.Sprintf("https://www.fast2sms.com/dev/bulkV2?authorization=%s&route=v3&sender_id=FTWSMS&message=%s&language=english&flash=0&numbers=%s",
		s.apiKey, encodedMessage, phoneNumber)

	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return err
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to send sms, status code: %d, response: %s", resp.StatusCode, string(body))
	}

	fmt.Printf("Fast2SMS Response: %s\n", string(body))
	fmt.Printf("Successfully sent OTP %s to phone %s via Fast2SMS\n", otp, phoneNumber)
	return nil
}
