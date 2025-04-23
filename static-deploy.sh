#!/bin/bash

# Debug info
echo "Starting static deployment script"
echo "Current directory: $(pwd)"

# Create client/dist directory
echo "Creating client/dist directory..."
mkdir -p client/dist

# Copy static HTML to dist directory
echo "Copying static HTML file to dist directory..."
cp fallback-index.html client/dist/index.html

# Check if copying was successful
echo "Checking if index.html exists in dist directory..."
if [ -f "client/dist/index.html" ]; then
  echo "Success! Static index.html deployed to client/dist."
  echo "Contents of client/dist directory:"
  ls -la client/dist
else
  echo "ERROR: Failed to copy index.html to client/dist!"
  exit 1
fi

echo "Static deployment completed successfully!" 