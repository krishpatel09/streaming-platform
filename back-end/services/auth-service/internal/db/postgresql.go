package db

import (
	"fmt"

	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/config"
	"github.com/krishpatel09/streaming-platform/services/auth-service/internal/domain"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectPostgres(cfg config.PostgresConfig) (*gorm.DB, error) {
	psqlInfo := fmt.Sprintf("host=%s user=%s dbname=%s port=%s password=%s", cfg.DBHost, cfg.DBUser, cfg.DBName, cfg.DBPort, cfg.DBPassword)
	DB, dbErr := gorm.Open(postgres.Open(psqlInfo), &gorm.Config{
		SkipDefaultTransaction: true,
	})

	if dbErr != nil {
		return nil, dbErr
	}
	fmt.Println("PostgreSQL Database Connected Successfully")

	// if DB.Migrator().HasIndex(&domain.User{}, "idx_users_username") {
	// 	DB.Migrator().DropIndex(&domain.User{}, "idx_users_username")
	// }

	DB.AutoMigrate(&domain.User{}, &domain.RefreshToken{})
	return DB, nil

}
