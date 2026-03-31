package config

import (
	"os"
)

type Config struct {
	Port         string
	KafkaBrokers []string
	DatabaseURL  string
	DatabaseName string
}

func Load() *Config {
	port := os.Getenv("NOTIFICATION_PORT")
	if port == "" {
		port = "8008"
	}

	kafkaBrokers := os.Getenv("KAFKA_BROKERS")
	if kafkaBrokers == "" {
		kafkaBrokers = "kafka:29092"
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "mongodb://mongodb:27017"
	}

	dbName := os.Getenv("DATABASE_NAME")
	if dbName == "" {
		dbName = "notification_db"
	}

	return &Config{
		Port:         port,
		KafkaBrokers: []string{kafkaBrokers},
		DatabaseURL:  dbURL,
		DatabaseName: dbName,
	}
}
