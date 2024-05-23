#!/bin/bash

# Perform a git pull to fetch the latest changes from deploy branch
echo "Pulling the latest changes from the deploy branch..."
git checkout deploy
git pull origin deploy

cd front

# Run your desired commands
echo "Building the front docker image..."
sudo docker build -t front -f Dockerfile .

cd ..

echo "Running docker compose..."
sudo docker compose up -d

echo "Deployment completed successfully!"