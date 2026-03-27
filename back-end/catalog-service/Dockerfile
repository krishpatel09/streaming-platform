# Build Stage
FROM golang:alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY shared ./shared
COPY catalog-service ./catalog-service
COPY .env ./

RUN go build -o main ./catalog-service/cmd/main.go

# Run Stage
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/.env .

EXPOSE 8003
CMD ["./main"]
