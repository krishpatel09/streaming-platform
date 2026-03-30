#!/bin/ash

# Wait for Kafka to be ready
echo "Waiting for Kafka to be ready..."
cub kafka-ready -b kafka:29092 1 30

# Create topics
echo "Creating Kafka topics..."

kafka-topics --create --if-not-exists --bootstrap-server kafka:29092 --partitions 1 --replication-factor 1 --topic video-uploaded
kafka-topics --create --if-not-exists --bootstrap-server kafka:29092 --partitions 1 --replication-factor 1 --topic transcoding-started
kafka-topics --create --if-not-exists --bootstrap-server kafka:29092 --partitions 1 --replication-factor 1 --topic transcoding-completed
kafka-topics --create --if-not-exists --bootstrap-server kafka:29092 --partitions 1 --replication-factor 1 --topic transcoding-failed
kafka-topics --create --if-not-exists --bootstrap-server kafka:29092 --partitions 1 --replication-factor 1 --topic content-added

echo "Kafka topics created successfully!"
