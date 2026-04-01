package config

import (
	"github.com/go-playground/validator/v10"
	"github.com/spf13/viper"
)

type MongoConfig struct {
	MongoUrl     string `mapstructure:"CATALOG_MONGO_URI"`
	MongoDB      string `mapstructure:"CATALOG_MONGO_DB"`
	KafkaBrokers string `mapstructure:"KAFKA_BROKERS"`
	Port         string `mapstructure:"CATALOG_PORT"`
}

var mongoEnvs = []string{
	"CATALOG_MONGO_URI", "CATALOG_MONGO_DB", "KAFKA_BROKERS", "CATALOG_PORT",
}

func LoadMongoConfig() (MongoConfig, error) {
	var cfg MongoConfig
	viper.SetConfigFile(".env")
	viper.AutomaticEnv() // Merge environment variables
	if err := viper.ReadInConfig(); err != nil {
		viper.SetConfigFile("../../.env")
		viper.ReadInConfig()
	}

	for _, env := range mongoEnvs {
		if err := viper.BindEnv(env); err != nil {
			return cfg, err
		}
	}
	err := viper.Unmarshal(&cfg)

	if err := validator.New().Struct(&cfg); err != nil {
		return cfg, err
	}

	return cfg, err
}
