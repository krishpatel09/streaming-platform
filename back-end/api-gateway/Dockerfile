# Build Stage
FROM golang:alpine AS builder

WORKDIR /app
# Copy root go.mod and go.sum for monorepo
COPY go.mod go.sum ./
RUN go mod download

# Copy necessary source code
COPY shared ./shared
COPY api-gateway ./api-gateway
COPY .env ./

RUN go build -o main ./api-gateway/cmd/main.go

# Run Stage
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/.env .

EXPOSE 5001
CMD ["./main"]
