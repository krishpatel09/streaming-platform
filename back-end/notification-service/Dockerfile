FROM golang:alpine AS builder

WORKDIR /app

# Copy the entire monorepo
COPY . .

# Build the binary specifically to the root of /app
RUN CGO_ENABLED=0 GOOS=linux go build -o /notification-service-bin notification-service/cmd/main.go

FROM alpine:latest

WORKDIR /root/

# Copy the binary from the builder stage
COPY --from=builder /notification-service-bin .

EXPOSE 8008

# Execute the binary
CMD ["./notification-service-bin"]
