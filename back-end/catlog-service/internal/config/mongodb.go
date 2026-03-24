package config

import (
	"github.com/go-playground/validator/v10"
	"github.com/spf13/viper"
)

type MongoConfig struct {
	MongoUrl string `mapstructure:"MONGO_URL"`
	MongoDB  string `mapstructure:"MONGO_DATABASE"`
}

var mongoEnvs = []string{
	"MONGO_URL", "MONGO_DATABASE",
}

func LoadMongoConfig() (MongoConfig, error) {
	var cfg MongoConfig
	viper.AddConfigPath("../../")
	viper.SetConfigFile("../../.env")
	viper.ReadInConfig()
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
