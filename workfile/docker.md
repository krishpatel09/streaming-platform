# docker-compose.yml — starts ALL 12 microservices + infra

version: "3.9"

networks:
internal: # services talk to each other here — never exposed to internet
driver: bridge

services:

# ─── Infrastructure ───────────────────────────────────────

postgres:
image: postgres:16
environment:
POSTGRES_USER: app
POSTGRES_PASSWORD: secret
POSTGRES_DB: platform
ports: - "5432:5432" # expose only for local debugging tools (DBeaver etc)
networks: [internal]

redis:
image: redis:7-alpine
ports: - "6379:6379" # same — debug only
networks: [internal]

kafka:
image: confluentinc/cp-kafka:7.6.0
environment:
KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
depends_on: [zookeeper]
networks: [internal]

zookeeper:
image: confluentinc/cp-zookeeper:7.6.0
environment:
ZOOKEEPER_CLIENT_PORT: 2181
networks: [internal]

# ─── API Gateway (THE only public port) ───────────────────

gateway:
build: ./services/gateway
ports: - "80:8080" # ← THE ONLY PUBLIC PORT clients hit - "443:8443"
environment:
AUTH_SVC_URL: http://auth:8001
USER_SVC_URL: http://user:8002
CATALOG_SVC_URL: http://catalog:8003
SEARCH_SVC_URL: http://search:8004
STREAMING_SVC_URL: http://streaming:8005
PAYMENT_SVC_URL: http://payment:8007
depends_on: [auth, user, catalog]
networks: [internal]

# ─── Core microservices ────────────────────────────────────

# NO ports exposed to host — only reachable inside Docker network

auth:
build: ./services/auth
environment:
PORT: 8001
DB_URL: postgres://app:secret@postgres:5432/platform
REDIS_URL: redis://redis:6379
JWT_SECRET: ${JWT_SECRET}
networks: [internal] # Note: NO "ports:" block — unreachable from outside

user:
build: ./services/user
environment:
PORT: 8002
DB_URL: postgres://app:secret@postgres:5432/platform
networks: [internal]

catalog:
build: ./services/catalog
environment:
PORT: 8003
DB_URL: postgres://app:secret@postgres:5432/platform
REDIS_URL: redis://redis:6379
networks: [internal]

search:
build: ./services/search
environment:
PORT: 8004
ELASTICSEARCH_URL: http://elasticsearch:9200
networks: [internal]

streaming:
build: ./services/streaming
environment:
PORT: 8005
S3_BUCKET: ${S3_BUCKET}
CDN_URL: ${CDN_URL}
networks: [internal]

transcoding:
build: ./services/transcoding
environment:
PORT: 8006
KAFKA_BROKERS: kafka:9092
S3_BUCKET: ${S3_BUCKET}
networks: [internal]

payment:
build: ./services/payment
environment:
PORT: 8007
DB_URL: postgres://app:secret@postgres:5432/platform
KAFKA_BROKERS: kafka:9092
networks: [internal]

notification:
build: ./services/notification
environment:
PORT: 8008
KAFKA_BROKERS: kafka:9092
networks: [internal]

watchlist:
build: ./services/watchlist
environment:
PORT: 8009
DB_URL: postgres://app:secret@postgres:5432/platform
networks: [internal]

recommendation:
build: ./services/recommendation
environment:
PORT: 8010
KAFKA_BROKERS: kafka:9092
networks: [internal]

analytics:
build: ./services/analytics
environment:
PORT: 8011
KAFKA_BROKERS: kafka:9092
networks: [internal]

admin:
build: ./services/admin
environment:
PORT: 8012
DB_URL: postgres://app:secret@postgres:5432/platform
networks: [internal]
