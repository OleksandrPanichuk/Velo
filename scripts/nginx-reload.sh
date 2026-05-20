#!/bin/bash
set -e

echo "Checking nginx configuration..."
docker compose exec nginx nginx -t


if [ $? -eq 0 ]; then
    echo "Config is valid. Reloading nginx..."
    docker compose exec nginx nginx -s reload
    echo "Nginx reloaded successfully."
else
    echo "Nginx configuration test failed. Please check the configuration files for errors."
    exit 1
fi