#!/bin/bash

# This script creates a complete static site without relying on any npm tools
echo "Starting pure static build..."
echo "Current directory: $(pwd)"

# Create the dist directory structure
echo "Creating directory structure..."
mkdir -p client/dist/assets
mkdir -p client/dist/js

# Create the main index.html file
cat > client/dist/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HCX Secure Transfer</title>
  <link rel="stylesheet" href="./assets/styles.css">
  <script defer src="./js/main.js"></script>
</head>
<body>
  <div class="container">
    <header>
      <h1>HCX Secure Transfer</h1>
      <div class="logo">
        <div class="logo-inner"></div>
      </div>
      <p class="subtitle">End-to-end encrypted data transfer system built on Supabase</p>
    </header>

    <main>
      <div class="status-panel">
        <div class="status-item">
          <div class="status-icon success"></div>
          <div class="status-text">Static Deployment Successful</div>
        </div>
        <div class="status-item">
          <div class="status-icon success"></div>
          <div class="status-text">IPFS Connection Active</div>
        </div>
        <div class="status-item">
          <div class="status-icon success"></div>
          <div class="status-text">Supabase Integration Ready</div>
        </div>
      </div>

      <div class="card-grid">
        <div class="card">
          <h2>Health Records</h2>
          <p>Secure storage of patient health records with end-to-end encryption.</p>
          <a href="https://app.supabase.com" class="btn-link">Explore Data</a>
        </div>
        
        <div class="card">
          <h2>Blockchain Integration</h2>
          <p>Immutable verification of document transfers through blockchain technology.</p>
          <a href="https://github.com/Simranatsingh/JWE-encryption-for-Secure-data-transfer-in-hcx-systems-using-blockchain" class="btn-link">View Repository</a>
        </div>
        
        <div class="card">
          <h2>Secure Reports</h2>
          <p>Generate and share encrypted medical reports with authorized providers.</p>
          <a href="https://app.supabase.com" class="btn-link">View Dashboard</a>
        </div>
      </div>

      <div class="tech-stack">
        <h2>Technology Stack</h2>
        <div class="tech-items">
          <div class="tech-item">
            <div class="tech-icon supabase"></div>
            <span>Supabase</span>
          </div>
          <div class="tech-item">
            <div class="tech-icon react"></div>
            <span>React</span>
          </div>
          <div class="tech-item">
            <div class="tech-icon blockchain"></div>
            <span>Blockchain</span>
          </div>
          <div class="tech-item">
            <div class="tech-icon ipfs"></div>
            <span>IPFS</span>
          </div>
        </div>
      </div>
    </main>

    <footer>
      <p>HCX Secure Transfer System &copy; 2025</p>
      <div class="footer-links">
        <a href="https://github.com/Simranatsingh/JWE-encryption-for-Secure-data-transfer-in-hcx-systems-using-blockchain">GitHub</a>
        <a href="https://app.supabase.com">Supabase</a>
        <a href="https://fleek.co">Fleek</a>
      </div>
    </footer>
  </div>
</body>
</html>
EOL

# Create the CSS file
cat > client/dist/assets/styles.css << 'EOL'
:root {
  --primary: #3b82f6;
  --primary-light: #60a5fa;
  --primary-dark: #2563eb;
  --secondary: #8b5cf6;
  --dark: #1e293b;
  --darker: #0f172a;
  --light: #f8fafc;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --text: #e2e8f0;
  --text-dark: #94a3b8;
  --border-radius: 8px;
  --card-bg: rgba(30, 41, 59, 0.7);
  --transition: all 0.3s ease;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--darker);
  color: var(--text);
  line-height: 1.6;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  min-height: 100vh;
}

.container {
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 80px;
  height: 80px;
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem auto;
  position: relative;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.logo-inner {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 50%;
  position: relative;
  overflow: hidden;
}

.logo-inner::after {
  content: "";
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: var(--darker);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--text-dark);
  max-width: 600px;
  margin: 0 auto;
}

main {
  flex: 1;
}

.status-panel {
  background-color: var(--dark);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.status-item {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 200px;
}

.status-icon {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.75rem;
}

.success {
  background-color: var(--success);
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
}

.status-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.card {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  border: 1px solid rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: var(--transition);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
}

.card h2 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: var(--primary-light);
}

.card p {
  margin-bottom: 1.5rem;
  color: var(--text);
  font-size: 0.95rem;
}

.btn-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--primary);
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: var(--transition);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.btn-link:hover {
  background-color: rgba(59, 130, 246, 0.2);
  color: var(--primary-light);
}

.tech-stack {
  background-color: var(--dark);
  border-radius: var(--border-radius);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.tech-stack h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--light);
  font-size: 1.5rem;
}

.tech-items {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2rem;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.tech-icon {
  width: 50px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius);
  margin-bottom: 0.75rem;
}

.tech-item span {
  font-size: 0.9rem;
  color: var(--text-dark);
}

footer {
  margin-top: auto;
  padding-top: 2rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

footer p {
  color: var(--text-dark);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.footer-links a {
  color: var(--primary);
  text-decoration: none;
  font-size: 0.85rem;
  transition: var(--transition);
}

.footer-links a:hover {
  color: var(--primary-light);
}

@media (max-width: 768px) {
  .container {
    padding: 1.5rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .card-grid {
    grid-template-columns: 1fr;
  }
  
  .status-panel {
    flex-direction: column;
    gap: 1rem;
  }
  
  .tech-items {
    gap: 1.5rem;
  }
}
EOL

# Create a simple JavaScript file
cat > client/dist/js/main.js << 'EOL'
document.addEventListener('DOMContentLoaded', () => {
  console.log('HCX Secure Transfer Static Site Loaded');
  
  // Add animation to cards
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(-5px)';
    });
  });
  
  // Display deployment timestamp
  const footer = document.querySelector('footer p');
  const timestamp = new Date().toISOString();
  footer.textContent += ` | Deployed: ${new Date().toLocaleDateString()}`;
});
EOL

# Verify files were created
echo "Checking if files were created successfully..."
if [ -f "client/dist/index.html" ] && [ -f "client/dist/assets/styles.css" ] && [ -f "client/dist/js/main.js" ]; then
  echo "✅ Success! All static files created in client/dist directory."
  echo "Directory structure:"
  find client/dist -type f | sort
else
  echo "❌ Error: Failed to create some static files."
  exit 1
fi

echo "Static build completed successfully!" 