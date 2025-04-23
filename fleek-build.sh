#!/bin/bash

# Show environment and context
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Fix permission issues
chmod +x client/node_modules/.bin/vite
chmod +x client/node_modules/vite/bin/vite.js

# Navigate to client directory
cd client || { echo "Failed to navigate to client directory"; exit 1; }
echo "Inside client directory: $(pwd)"
echo "Client directory contents:"
ls -la

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the app
echo "Building the app..."
npm run build:fleek

# Verify dist directory
echo "Checking dist directory..."
if [ -d "dist" ]; then
  echo "Dist directory exists!"
  echo "Contents of dist directory:"
  ls -la dist
else
  echo "ERROR: Dist directory does not exist!"
  exit 1
fi

echo "Build completed successfully!" 