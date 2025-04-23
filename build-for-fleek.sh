#!/bin/bash

# Debug info
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Navigate to client directory
cd client || exit 1
echo "Inside client directory: $(pwd)"
echo "Client directory contents:"
ls -la

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the app
echo "Building the app..."
npm run build:fleek

# Debug dist directory
echo "Dist directory after build:"
ls -la dist

echo "Build completed successfully!" 