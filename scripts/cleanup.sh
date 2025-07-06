#!/bin/bash
echo "[CLEANUP] Pruning unused Docker images and volumes..."
docker system prune -af || true
