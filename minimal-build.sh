#!/bin/bash

# Debug info
echo "Starting minimal build script"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"

# Navigate to client directory
cd client || exit 1
echo "Inside client directory: $(pwd)"

# Install dependencies
echo "Installing dependencies..."
npm install

# Install Vite globally to ensure access to the command
echo "Installing Vite globally..."
npm install -g vite

# Create dist directory
echo "Creating dist directory..."
mkdir -p dist

# Build the app using npx to ensure proper execution
echo "Building the app with npx..."
VITE_FLEEK_DEPLOYMENT=true npx vite build --emptyOutDir --outDir dist

# Check if dist has content
echo "Checking dist directory content..."
if [ -f "dist/index.html" ]; then
  echo "Success! dist/index.html exists."
  echo "Contents of dist directory:"
  ls -la dist
else
  echo "ERROR: Build failed, dist/index.html not found!"
  echo "Current dist contents (if any):"
  ls -la dist
  exit 1
fi

echo "Build completed successfully!" 