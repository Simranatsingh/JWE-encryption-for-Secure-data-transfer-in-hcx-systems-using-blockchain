#!/bin/bash

# Debug info
echo "Starting direct Vite build script"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"

# Create a minimal Vite config file in the current directory
cat > vite.config.js << 'EOL'
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'client/dist',
    emptyOutDir: true
  }
});
EOL

# Create a minimal package.json with just one dependency
cat > temp-package.json << 'EOL'
{
  "name": "temp-build",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "dependencies": {
    "vite": "^4.5.0"
  }
}
EOL

# Install Vite globally
echo "Installing Vite globally..."
npm install -g vite

# Install Vite locally from the temp package.json
echo "Installing local Vite..."
npm install --prefix ./temp-build -g vite

# Use NPX to run Vite build with the minimal config
echo "Building with direct Vite command..."
cd client
npx --no-install vite build --config ../vite.config.js

# Check if dist was created
echo "Checking for dist directory..."
if [ -d "dist" ]; then
  echo "Success! Dist directory exists."
  echo "Contents of dist directory:"
  ls -la dist
else
  echo "ERROR: Dist directory does not exist! Falling back to copy method."
  cd ..
  # Fall back to the copy method if build fails
  chmod +x ./copy-dist.sh && ./copy-dist.sh
  exit 0
fi

echo "Build completed successfully!" 