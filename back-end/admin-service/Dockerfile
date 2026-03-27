# Build Stage
FROM golang:alpine AS builder

WORKDIR /app
# Copy root go.mod and go.sum for monorepo
COPY go.mod go.sum ./
RUN go mod download

# Copy necessary source code
COPY shared ./shared
COPY admin-service ./admin-service
COPY .env ./

RUN go build -o main ./admin-service/cmd/main.go

# Run Stage
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/.env .

EXPOSE 8012
CMD ["./main"]
