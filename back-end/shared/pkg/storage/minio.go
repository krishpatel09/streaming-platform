package storage

import (
	"context"
	"fmt"
	"net"
	"net/http"
	"strings"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type Storage interface {
	GetPresignedURL(ctx context.Context, bucketName, objectName string, expiry time.Duration) (string, error)
	UploadFile(ctx context.Context, bucketName, objectName string, filePath string, contentType string) error
	CreateBucket(ctx context.Context, bucketName string) error
}

type minioStorage struct {
	client        *minio.Client
	signingClient *minio.Client
}

func NewMinioStorage(endpoint, accessKey, secretKey string, useSSL bool, publicEndpoint string) (Storage, error) {
	// 1. Client for actual operations (internal connectivity)
	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to initialize minio client: %w", err)
	}

	// 2. Client for signing (reflects what user sees)
	signingEndpoint := publicEndpoint
	if signingEndpoint != "" {
		signingEndpoint = strings.TrimPrefix(signingEndpoint, "http://")
		signingEndpoint = strings.TrimPrefix(signingEndpoint, "https://")
	} else {
		signingEndpoint = endpoint
	}

	// Create a transport that redirects the public host to the internal endpoint
	// This allows the signing client to "connect" to localhost while inside Docker
	transport := &http.Transport{
		DialContext: func(ctx context.Context, network, addr string) (net.Conn, error) {
			// If the client tries to hit the public endpoint, redirect to the internal one
			if strings.Contains(addr, "localhost") || strings.Contains(addr, "127.0.0.1") {
				addr = endpoint
			}
			return (&net.Dialer{}).DialContext(ctx, network, addr)
		},
	}

	signingClient, err := minio.New(signingEndpoint, &minio.Options{
		Creds:     credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure:    useSSL,
		Transport: transport,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to initialize signing client: %w", err)
	}

	return &minioStorage{client: client, signingClient: signingClient}, nil
}

func (s *minioStorage) GetPresignedURL(ctx context.Context, bucketName, objectName string, expiry time.Duration) (string, error) {
	// Use signingClient to ensure the URL (and its signature) reflects the public host
	url, err := s.signingClient.PresignedPutObject(ctx, bucketName, objectName, expiry)
	if err != nil {
		return "", fmt.Errorf("failed to generate presigned URL: %w", err)
	}

	return url.String(), nil
}

func (s *minioStorage) CreateBucket(ctx context.Context, bucketName string) error {
	var err error
	for i := 0; i < 5; i++ {
		exists, err := s.client.BucketExists(ctx, bucketName)
		if err == nil {
			if exists {
				return nil
			}
			err = s.client.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
			if err == nil {
				fmt.Printf("✅ Created bucket: %s\n", bucketName)
				return nil
			}
		}

		fmt.Printf("⏳ Waiting for MinIO... attempt %d/5 (%v)\n", i+1, err)
		time.Sleep(2 * time.Second)
	}
	return fmt.Errorf("failed to create bucket %s after 5 attempts: %w", bucketName, err)
}

func (s *minioStorage) UploadFile(ctx context.Context, bucketName, objectName string, filePath string, contentType string) error {
	_, err := s.client.FPutObject(ctx, bucketName, objectName, filePath, minio.PutObjectOptions{
		ContentType: contentType,
	})
	return err
}
