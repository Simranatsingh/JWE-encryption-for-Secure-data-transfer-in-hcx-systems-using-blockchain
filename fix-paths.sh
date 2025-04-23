#!/bin/bash

# Debug information
echo "Current working directory: $(pwd)"
echo "Contents of the current directory:"
ls -la

# Get absolute path of the project directory
PROJECT_DIR="$(pwd)"
echo "Project absolute path: $PROJECT_DIR"

# Create dist directory with absolute path
DIST_DIR="$PROJECT_DIR/client/dist"
echo "Target dist directory: $DIST_DIR"

echo "Creating dist directory with absolute path..."
mkdir -p "$DIST_DIR"
mkdir -p "$DIST_DIR/assets"
mkdir -p "$DIST_DIR/js"

# Create a minimal HTML file
echo "Creating index.html in $DIST_DIR..."
cat > "$DIST_DIR/index.html" << 'EOL'
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HCX Secure Transfer</title>
  <link rel="stylesheet" href="./assets/styles.css">
</head>
<body>
  <h1>HCX Secure Transfer</h1>
  <p>Successfully deployed to IPFS via Fleek!</p>
</body>
</html>
EOL

# Create a minimal CSS file
echo "Creating styles.css in $DIST_DIR/assets..."
cat > "$DIST_DIR/assets/styles.css" << 'EOL'
body {
  font-family: sans-serif;
  background-color: #0f172a;
  color: white;
  text-align: center;
  padding: 50px;
}
h1 {
  color: #3b82f6;
}
EOL

# Verify the files exist
echo "Checking if files were created:"
find "$DIST_DIR" -type f -ls

echo "Publish directory path to use in Fleek: client/dist"
echo "Absolute path of publish directory: $DIST_DIR" 