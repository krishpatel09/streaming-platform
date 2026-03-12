package config

import (
	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

type PostgresConfig struct {
	DBHost     string `mapstructure:"DB_HOST"`
	DBName     string `mapstructure:"DB_NAME"`
	DBUser     string `mapstructure:"DB_USER"`
	DBPort     string `mapstructure:"DB_PORT"`
	DBPassword string `mapstructure:"DB_PASSWORD"`
}

var envs = []string{
	"DB_HOST", "DB_NAME", "DB_USER", "DB_PORT", "DB_PASSWORD",
}

func LoadPostgresConfig() (PostgresConfig, error) {
	var cfg PostgresConfig
	viper.AddConfigPath("../../")
	viper.SetConfigFile("../../.env")
	viper.ReadInConfig()
	for _, env := range envs {
		if err := viper.BindEnv(env); err != nil {
			return cfg, err
		}
	}
	cfgerr := viper.Unmarshal(&cfg)

	if err := validator.New().Struct(&cfg); err != nil {
		return cfg, err
	}
	err := LoadEnv()
	if err != nil {
		return cfg, err
	}

	return cfg, cfgerr

}

func LoadEnv() error {
	err := godotenv.Load("../../.env")
	if err != nil {
		return err
	}
	return nil
}
