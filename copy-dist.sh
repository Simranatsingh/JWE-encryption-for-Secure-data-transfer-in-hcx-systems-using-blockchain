#!/bin/bash

# Debug environment
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Create a complete dist directory with all necessary files
echo "Creating dist directory structure..."
mkdir -p client/dist/assets

# Create index.html
cat > client/dist/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HCX Secure Transfer</title>
  <link rel="stylesheet" href="./assets/styles.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>HCX Secure Transfer</h1>
      <p class="subtitle">A blockchain-based secure data transfer system</p>
    </header>

    <main>
      <div class="card">
        <div class="status-badge">
          <span class="status-dot"></span>
          <span class="status-text">Successfully Deployed</span>
        </div>
        
        <p>This is a static version of the HCX Secure Transfer application successfully deployed to IPFS via Fleek.</p>
        
        <div class="features">
          <div class="feature">
            <h3>Secure Transfer</h3>
            <p>End-to-end encrypted data transfer for healthcare information</p>
          </div>
          <div class="feature">
            <h3>Blockchain Verified</h3>
            <p>Transaction integrity verified through blockchain technology</p>
          </div>
          <div class="feature">
            <h3>Supabase Backend</h3>
            <p>Powered by Supabase for secure data storage and retrieval</p>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <a href="https://github.com/Simranatsingh/JWE-encryption-for-Secure-data-transfer-in-hcx-systems-using-blockchain" class="btn primary">View on GitHub</a>
        <a href="https://app.supabase.com" class="btn secondary">Supabase Dashboard</a>
      </div>
    </main>

    <footer>
      <p>&copy; 2025 HCX Secure Transfer</p>
    </footer>
  </div>
</body>
</html>
EOL

# Create CSS file
cat > client/dist/assets/styles.css << 'EOL'
:root {
  --primary: #3b82f6;
  --primary-dark: #2563eb;
  --secondary: #8b5cf6;
  --bg-dark: #0f172a;
  --bg-card: rgba(30, 41, 59, 0.7);
  --text: #e2e8f0;
  --text-muted: #94a3b8;
  --success: #10b981;
  --border-radius: 12px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-dark);
  color: var(--text);
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  text-align: center;
  margin-bottom: 3rem;
  padding-top: 2rem;
}

h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--text-muted);
}

main {
  flex: 1;
}

.card {
  background-color: var(--bg-card);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  margin-bottom: 2rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: rgba(16, 185, 129, 0.1);
  border-radius: 2rem;
  margin-bottom: 1.5rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  background-color: var(--success);
  border-radius: 50%;
  margin-right: 0.5rem;
}

.status-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--success);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature {
  padding: 1.5rem;
  background-color: rgba(15, 23, 42, 0.5);
  border-radius: var(--border-radius);
  transition: transform 0.3s ease;
}

.feature:hover {
  transform: translateY(-5px);
}

.feature h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--primary);
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  text-align: center;
}

.primary {
  background-color: var(--primary);
  color: white;
}

.primary:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
}

.secondary {
  background-color: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
}

.secondary:hover {
  background-color: rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

footer {
  text-align: center;
  padding: 2rem 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .features {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
EOL

# Check if the files were created
echo "Checking if files exist..."
if [ -f "client/dist/index.html" ] && [ -f "client/dist/assets/styles.css" ]; then
  echo "Success! Static files deployed to client/dist."
  echo "Contents of client/dist directory:"
  ls -la client/dist
  echo "Contents of client/dist/assets directory:"
  ls -la client/dist/assets
else
  echo "ERROR: Failed to create static files!"
  exit 1
fi

echo "Static deployment completed successfully!" 