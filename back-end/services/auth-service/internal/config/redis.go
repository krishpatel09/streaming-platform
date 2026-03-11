package config

import (
	"github.com/go-playground/validator/v10"
	"github.com/spf13/viper"
)

type RedisConfig struct {
	RedisHost     string `mapstructure:"REDIS_HOST"`
	RedisPort     string `mapstructure:"REDIS_PORT"`
	RedisPassword string `mapstructure:"REDIS_PASSWORD"`
	RedisDB       int    `mapstructure:"REDIS_DB"`
}

var redisEnvs = []string{
	"REDIS_HOST", "REDIS_PORT", "REDIS_PASSWORD", "REDIS_DB",
}

func LoadRedisConfig() (RedisConfig, error) {
	var cfg RedisConfig
	viper.AddConfigPath("./")
	viper.SetConfigFile(".env")
	viper.ReadInConfig()
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
