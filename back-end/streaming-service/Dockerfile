# Build Stage
FROM golang:alpine AS builder

WORKDIR /app
# Copy root go.mod and go.sum for monorepo
COPY go.mod go.sum ./
RUN go mod download

# Copy necessary source code
COPY shared ./shared
COPY streaming-service ./streaming-service
COPY .env ./

RUN go build -o main ./streaming-service/cmd/main.go

# Run Stage
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/.env .

EXPOSE 8005
CMD ["./main"]
