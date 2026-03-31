FROM golang:alpine AS builder

WORKDIR /app

# Copy the entire backend monorepo to access shared packages
COPY . .

# Build the specific service binary
RUN CGO_ENABLED=0 GOOS=linux go build -o /transcoding-service-bin transcoding-service/cmd/main.go

FROM alpine:latest

WORKDIR /root/

# Copy the compiled binary from the builder stage
COPY --from=builder /transcoding-service-bin .

# The transcoding service doesn't expose a port (it's a Kafka consumer),
# but we follow the standard RUN/ENTRYPOINT pattern here.
CMD ["./transcoding-service-bin"]
