package repository

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisRepository interface {
	SetRefreshToken(token string, userID string, expiration time.Duration) error
	GetRefreshToken(token string) (string, error)
	DeleteRefreshToken(token string) error
}

type redisRepository struct {
	db *redis.Client
}

func NewRedisRepository(db *redis.Client) RedisRepository {
	return &redisRepository{db: db}
}

func (r *redisRepository) SetRefreshToken(token string, userID string, expiration time.Duration) error {
	ctx := context.Background()
	return r.db.Set(ctx, "refresh:"+token, userID, expiration).Err()
}

func (r *redisRepository) GetRefreshToken(token string) (string, error) {
	ctx := context.Background()
	return r.db.Get(ctx, "refresh:"+token).Result()
}

func (r *redisRepository) DeleteRefreshToken(token string) error {
	ctx := context.Background()
	return r.db.Del(ctx, "refresh:"+token).Err()
}
