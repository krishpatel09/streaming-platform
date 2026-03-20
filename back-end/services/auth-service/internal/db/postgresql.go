package db

import (
	"fmt"

	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/config"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/domain"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func ConnectPostgres(cfg config.PostgresConfig) (*gorm.DB, error) {
	psqlInfo := fmt.Sprintf("host=%s user=%s dbname=%s port=%s password=%s", cfg.DBHost, cfg.DBUser, cfg.DBName, cfg.DBPort, cfg.DBPassword)
	DB, dbErr := gorm.Open(postgres.Open(psqlInfo), &gorm.Config{
		SkipDefaultTransaction: true,
		Logger:                 logger.Default.LogMode(logger.Silent),
	})

	if dbErr != nil {
		return nil, dbErr
	}
	fmt.Println("PostgreSQL Database Connected Successfully")

	// Enable pgcrypto for gen_random_uuid()
	_ = DB.Exec("CREATE EXTENSION IF NOT EXISTS pgcrypto;")

	DB.AutoMigrate(
		&domain.User{},
		&domain.OTPVerification{},
		&domain.Device{},
		&domain.RefreshToken{},
		&domain.Profile{},
		&domain.UserPreference{},
		&domain.OTPBypass{},
		&domain.SessionActivity{},
	)
	return DB, nil

}
