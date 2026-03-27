package config

import (
	"github.com/go-playground/validator/v10"
	"github.com/spf13/viper"
)

type RedisConfig struct {
	RedisHost     string `mapstructure:"AUTH_REDIS_HOST"`
	RedisPort     string `mapstructure:"AUTH_REDIS_PORT"`
	RedisPassword string `mapstructure:"REDIS_PASSWORD"`
	RedisDB       int    `mapstructure:"AUTH_REDIS_DB"`
}

var redisEnvs = []string{
	"AUTH_REDIS_HOST", "AUTH_REDIS_PORT", "REDIS_PASSWORD", "AUTH_REDIS_DB",
}

func LoadRedisConfig() (RedisConfig, error) {
	var cfg RedisConfig
	viper.SetConfigFile(".env")
	if err := viper.ReadInConfig(); err != nil {
		viper.SetConfigFile("../.env")
		viper.ReadInConfig()
	}
	for _, env := range redisEnvs {
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
