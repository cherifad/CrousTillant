#!/bin/bash

# Perform a git pull to fetch the latest changes
git pull

cd front

# Run your desired commands
echo "Building the front docker image..."
sudo docker build -t front -f Dockerfile .

cd ..

echo "Running docker compose..."
sudo docker compose up -d

echo "Deployment completed successfully!"