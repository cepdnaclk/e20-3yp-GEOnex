#!/bin/bash
echo "[STOP] Stopping any running containers..."
cd /home/ubuntu/app/backend/src/services
docker compose down || true
