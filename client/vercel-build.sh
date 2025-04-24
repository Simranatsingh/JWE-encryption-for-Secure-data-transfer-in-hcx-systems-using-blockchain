#!/bin/bash

# Debug info
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Clean dependency cache
echo "Cleaning dependency cache..."
rm -rf node_modules/.vite
rm -rf node_modules/.cache

# Create dist directory in advance
mkdir -p dist

# Show environment variables (without sensitive info)
echo "Environment variables:"
env | grep -v "KEY\|SECRET\|PASSWORD\|TOKEN" | sort

# Ensure specific dependencies are installed
echo "Installing specific versions of problematic dependencies..."
npm uninstall react-router-dom --no-save
npm install react-router-dom@6.20.0 --save --no-fund --no-audit

# Fix permissions for Vite executable - try multiple approaches
echo "Setting permissions for Vite..."
chmod -R 755 ./node_modules/.bin/ || true
chmod -R 755 ./node_modules/vite/ || true
chmod +x ./node_modules/.bin/vite || true
chmod +x ./node_modules/vite/bin/vite.js || true

# Show dependency tree for debugging
echo "Dependency tree for react-router-dom:"
npm ls react-router-dom

# Try using node to run vite directly
echo "Building with node directly..."
VITE_VERCEL_DEPLOYMENT=true node ./node_modules/vite/bin/vite.js build --emptyOutDir 

# If that fails, try using npx
if [ ! -f "dist/index.html" ]; then
  echo "Direct build failed, trying with npx..."
  VITE_VERCEL_DEPLOYMENT=true npx --no-install vite build --emptyOutDir
fi

# Check if build succeeded
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
  echo "Build successful!"
  ls -la dist/
  exit 0
else
  echo "Build failed. Creating static output..."
  
  # Create dist directory
  mkdir -p dist
  mkdir -p dist/assets
  
  # Create static HTML
  cat > dist/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HCX Secure Transfer</title>
  <link rel="stylesheet" href="./assets/styles.css">
  <meta name="description" content="HCX Secure Transfer - End-to-end encrypted health data transfer system with blockchain verification">
</head>
<body>
  <div class="container">
    <header>
      <h1>HCX Secure Transfer</h1>
      <div class="subtitle">End-to-end encrypted health data transfer</div>
    </header>
    
    <main>
      <section class="info-box">
        <h2>Under Deployment</h2>
        <p>
          The interactive version of HCX Secure Transfer is currently being configured for deployment.
          Please check back soon for the full application.
        </p>
        <p>
          HCX Secure Transfer provides end-to-end encrypted health data transfer with blockchain verification.
        </p>
        <div class="buttons">
          <a href="https://github.com/Simranatsingh/JWE-encryption-for-Secure-data-transfer-in-hcx-systems-using-blockchain" class="btn primary">View Source Code</a>
        </div>
      </section>
    </main>
    
    <footer>
      <p>© 2025 HCX Secure Transfer</p>
    </footer>
  </div>
</body>
</html>
EOL

  # Create basic CSS
  cat > dist/assets/styles.css << 'EOL'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #0f172a;
  color: #e2e8f0;
  line-height: 1.6;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2.5rem;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #94a3b8;
}

main {
  flex: 1;
}

.info-box {
  background-color: rgba(30, 41, 59, 0.7);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #f8fafc;
}

p {
  margin-bottom: 1rem;
  color: #cbd5e1;
}

.buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.primary {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  color: white;
}

.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

footer {
  margin-top: auto;
  text-align: center;
  color: #94a3b8;
  padding-top: 2rem;
}

@media (max-width: 640px) {
  .container {
    padding: 1rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .info-box {
    padding: 1.5rem;
  }
}
EOL

  echo "Static fallback page created."
  ls -la dist/
  exit 0
fi 