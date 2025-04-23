#!/bin/bash

echo "Creating static fallback deployment..."

# Ensure dist directory exists
mkdir -p dist

# Create a static HTML file with basic styling
cat > dist/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Week 1 Website - Static Version</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>Week 1 Website</h1>
      <div class="subtitle">Static Deployment</div>
    </header>
    
    <main>
      <section class="info-box">
        <h2>Static Version</h2>
        <p>
          This is a static version of the Week 1 Website application. 
          The full interactive version is still being configured for deployment.
        </p>
        <p>
          Please check back soon or visit the repository for the latest updates.
        </p>
        <div class="buttons">
          <a href="https://github.com/user/week-1-website" class="btn primary">View Source Code</a>
        </div>
      </section>
    </main>
    
    <footer>
      <p>© 2023 Week 1 Website Project</p>
    </footer>
  </div>
</body>
</html>
EOL

# Create CSS file
cat > dist/styles.css << 'EOL'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #121212;
  color: #e0e0e0;
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
  background: linear-gradient(45deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #9ca3af;
}

main {
  flex: 1;
}

.info-box {
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #f3f4f6;
}

p {
  margin-bottom: 1rem;
  color: #d1d5db;
}

.buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  display: inline-block;
  padding: 0.7rem 1.5rem;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.primary {
  background: linear-gradient(45deg, #6366f1, #8b5cf6);
  color: white;
}

.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

footer {
  margin-top: auto;
  text-align: center;
  color: #9ca3af;
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

echo "Static deployment files created successfully!"
echo "Files in dist directory:"
ls -la dist/

# Signal success
echo "Static deployment ready."
exit 0 