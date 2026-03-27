# Build Stage
FROM golang:alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY shared ./shared
COPY auth-service ./auth-service
COPY .env ./

RUN go build -o main ./auth-service/cmd/main.go

# Run Stage
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/.env .

EXPOSE 5002
CMD ["./main"]
