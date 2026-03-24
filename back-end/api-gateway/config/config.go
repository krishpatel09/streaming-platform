package config

// import (
// 	"os"
// 	"strings"
// )

// type ServiceURLs struct {
// 	Auth         string
// 	User         string
// 	Catalog      string
// 	Search       string
// 	Streaming    string
// 	Transcoding  string
// 	Payment      string
// 	Notification string
// 	Watchlist    string
// 	Recommend    string
// 	Analytics    string
// 	Admin        string
// }

// type Config struct {
// 	Env            string
// 	Port           string
// 	JWTSecret      string
// 	RedisURL       string
// 	Services       ServiceURLs
// 	AllowedOrigins []string
// 	RateLimit      int
// }

// func Load() *Config {
// 	return &Config{
// 		Env:       getEnv("ENV", "development"),
// 		Port:      getEnv("PORT", "8080"),
// 		JWTSecret: getEnv("JWT_SECRET", "change-me-in-production"),
// 		RedisURL:  getEnv("REDIS_URL", "redis://localhost:6379"),
// 		Services: ServiceURLs{
// 			Auth:         getEnv("AUTH_SERVICE_URL", "http://localhost:8001"),
// 			User:         getEnv("USER_SERVICE_URL", "http://localhost:8002"),
// 			Catalog:      getEnv("CATALOG_SERVICE_URL", "http://localhost:8003"),
// 			Search:       getEnv("SEARCH_SERVICE_URL", "http://localhost:8004"),
// 			Streaming:    getEnv("STREAMING_SERVICE_URL", "http://localhost:8005"),
// 			Transcoding:  getEnv("TRANSCODING_SERVICE_URL", "http://localhost:8006"),
// 			Payment:      getEnv("PAYMENT_SERVICE_URL", "http://localhost:8007"),
// 			Notification: getEnv("NOTIFICATION_SERVICE_URL", "http://localhost:8008"),
// 			Watchlist:    getEnv("WATCHLIST_SERVICE_URL", "http://localhost:8009"),
// 			Recommend:    getEnv("RECOMMEND_SERVICE_URL", "http://localhost:8010"),
// 			Analytics:    getEnv("ANALYTICS_SERVICE_URL", "http://localhost:8011"),
// 			Admin:        getEnv("ADMIN_SERVICE_URL", "http://localhost:8012"),
// 		},
// 		AllowedOrigins: strings.Split(getEnv("ALLOWED_ORIGINS", "http://localhost:3000"), ","),
// 		RateLimit:      100,
// 	}
// }

// func getEnv(key, fallback string) string {
// 	if v := os.Getenv(key); v != "" {
// 		return v
// 	}
// 	return fallback
// }
