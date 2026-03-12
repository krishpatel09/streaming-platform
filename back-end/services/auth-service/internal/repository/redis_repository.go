package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisRepository interface {
	SetOTP(email string, otp string, expiration time.Duration) error
	GetOTP(email string) (string, error)
	DeleteOTP(email string) error
}

type redisRepository struct {
	db *redis.Client
}

func NewRedisRepository(db *redis.Client) RedisRepository {
	return &redisRepository{db: db}
}

func (r *redisRepository) SetOTP(email string, otp string, expiration time.Duration) error {
	ctx := context.Background()
	fmt.Printf("Storing OTP in Redis - Email: %s, OTP: %s\n", email, otp)
	return r.db.Set(ctx, "otp:"+email, otp, expiration).Err()
}

func (r *redisRepository) GetOTP(email string) (string, error) {
	ctx := context.Background()
	return r.db.Get(ctx, "otp:"+email).Result()
}

func (r *redisRepository) DeleteOTP(email string) error {
	ctx := context.Background()
	return r.db.Del(ctx, "otp:"+email).Err()
}
