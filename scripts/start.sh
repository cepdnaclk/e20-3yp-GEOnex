#!/bin/bash
echo "[START] Starting Docker Compose from backend directory..."
cd /home/ubuntu/app/backend/src/services
docker compose up -d --build
