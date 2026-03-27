package config

import (
	"os"

	"github.com/spf13/viper"
)

type Config struct {
	Env          string
	Port         string
	DatabaseURL  string
	DatabaseName string
	KafkaBrokers []string
}

func Load() *Config {
	viper.SetConfigFile(".env")
	viper.AutomaticEnv() // Merge environment variables
	if err := viper.ReadInConfig(); err != nil {
		viper.SetConfigFile("../../.env")
		viper.ReadInConfig()
	}

	return &Config{
		Env:          viper.GetString("ENVIRONMENT"),
		Port:         viper.GetString("ADMIN_PORT"),
		DatabaseURL:  viper.GetString("ADMIN_MONGO_URI"),
		DatabaseName: viper.GetString("ADMIN_MONGO_DB"),
		KafkaBrokers: []string{viper.GetString("KAFKA_BROKERS")},
	}

}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
