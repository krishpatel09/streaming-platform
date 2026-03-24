package redis

// import (
// 	"context"
// 	"encoding/json"
// 	"time"

// 	"github.com/redis/go-redis/v9"
// )

// type Client struct {
// 	rdb *redis.Client
// }

// func New(url string) (*Client, error) {
// 	opts, err := redis.ParseURL(url)
// 	if err != nil {
// 		return nil, err
// 	}
// 	rdb := redis.NewClient(opts)
// 	if err := rdb.Ping(context.Background()).Err(); err != nil {
// 		return nil, err
// 	}
// 	return &Client{rdb: rdb}, nil
// }

// func (c *Client) Set(ctx context.Context, key string, value interface{}, ttl time.Duration) error {
// 	data, err := json.Marshal(value)
// 	if err != nil {
// 		return err
// 	}
// 	return c.rdb.Set(ctx, key, data, ttl).Err()
// }

// func (c *Client) Get(ctx context.Context, key string, dest interface{}) error {
// 	data, err := c.rdb.Get(ctx, key).Bytes()
// 	if err != nil {
// 		return err
// 	}
// 	return json.Unmarshal(data, dest)
// }

// func (c *Client) Delete(ctx context.Context, keys ...string) error {
// 	return c.rdb.Del(ctx, keys...).Err()
// }

// func (c *Client) Exists(ctx context.Context, key string) (bool, error) {
// 	n, err := c.rdb.Exists(ctx, key).Result()
// 	return n > 0, err
// }

// func (c *Client) Incr(ctx context.Context, key string) (int64, error) {
// 	return c.rdb.Incr(ctx, key).Result()
// }

// func (c *Client) Expire(ctx context.Context, key string, ttl time.Duration) error {
// 	return c.rdb.Expire(ctx, key, ttl).Err()
// }
