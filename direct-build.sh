#!/bin/bash

# Debug info
echo "Starting direct build script"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "Directory listing:"
ls -la

# Navigate to client directory
cd client || { echo "Failed to navigate to client directory"; exit 1; }
echo "Now in client directory: $(pwd)"

# Install dependencies
echo "Installing dependencies..."
npm install

# Make Vite executable
echo "Setting permissions for Vite..."
chmod -R 755 node_modules/.bin/
chmod -R 755 node_modules/vite/bin/

# Show where Vite should be
echo "Checking Vite executable..."
ls -la node_modules/.bin/vite
ls -la node_modules/vite/bin/vite.js || echo "vite.js not found in expected location"

# Build directly using Vite executable and environment variables
echo "Building directly with Vite..."
VITE_FLEEK_DEPLOYMENT=true ./node_modules/.bin/vite build --emptyOutDir --outDir dist

# Check if dist was created
echo "Checking for dist directory..."
if [ -d "dist" ]; then
  echo "Success! Dist directory exists."
  echo "Contents of dist directory:"
  ls -la dist
else
  echo "ERROR: Dist directory does not exist!"
  echo "Current directory contents:"
  ls -la
  echo "Node modules contents:"
  ls -la node_modules/.bin/
  exit 1
fi

echo "Build completed successfully!" 