#!/bin/bash

set -e

PROJECT_DIR="/var/www/splititright"
COMPOSE_FILE="docker-compose.prod.yml"

echo "Starting Deployment to $PROJECT_DIR..."
cd "$PROJECT_DIR"

echo "Pulling..."
git pull origin main

echo "Building Frontend assets..."
DOCKER_BUILDKIT=1 docker build -f client/Dockerfile.prod -o client/dist ./client

echo "Updating Backend and Database containers..."
docker-compose -f "$COMPOSE_FILE" up -d --build

echo "Running Database Migrations..."
docker-compose -f "$COMPOSE_FILE" exec -T server npx prisma migrate deploy

echo "Cleaning up old Docker images..."
docker image prune -f

echo "deployed"
