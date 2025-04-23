# Fleek Deployment Guide

This guide will help you deploy the HCX Secure Transfer application to Fleek, connecting it to IPFS for decentralized hosting.

## Deployment Steps

### 1. Go to Fleek

Visit [app.fleek.co](https://app.fleek.co/) and sign in or create an account.

### 2. Add a New Site

Click on "Add new site" on your Fleek dashboard.

### 3. Connect to GitHub

- Choose "Connect with GitHub"
- Select your repository: `Simranatsingh/JWE-encryption-for-Secure-data-transfer-in-hcx-systems-using-blockchain`

### 4. Configure Build Settings

Use these exact settings:

- **Framework**: Other
- **Docker Image**: node:16
- **Build Command**: `chmod +x ./pure-static-build.sh && ./pure-static-build.sh`
- **Publish Directory**: `client/dist`
- **Base Directory**: `/` (default)
- **Environment Variables**:
  - `VITE_FLEEK_DEPLOYMENT`: `true`
  - `VITE_SUPABASE_URL`: `https://ekhuscbqsqrljhkzukak.supabase.co`
  - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVraHVzY2Jxc3FybGpoa3p1a2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzOTU2MjAsImV4cCI6MjA2MDk3MTYyMH0.LS9TlpTsYNW859wHMwjdGkitDOcC5-YkkR93VKXCwDE`

### 5. Deploy

Click "Deploy site" and wait for the build to complete.

## How It Works

This deployment uses a pure static build approach that:

1. Doesn't rely on npm or Vite (avoiding permission issues)
2. Creates all necessary files directly using shell commands
3. Builds a complete static website with HTML, CSS, and JavaScript
4. Always reliably produces the client/dist directory

## Alternative Options

If you want to try different approaches, the repository includes several other deployment options:

1. **Debug Build** (`fleek-debug.json`): Provides extensive debugging information
2. **Direct Vite Build** (`fleek-direct-vite.json`): Attempts to use Vite directly
3. **Copy Build** (`fleek-copy.json`): Creates a static site with a different design

## Troubleshooting

If you encounter any issues during deployment:

1. Check the build logs for specific error messages
2. Ensure the repository has the latest version of the deployment scripts
3. Verify that all script files have executable permissions
4. Try one of the alternative deployment methods if the primary one fails

## After Deployment

After successful deployment, Fleek will provide:

- A Fleek URL: `https://[your-site-name].on.fleek.co`
- An IPFS hash: `ipfs://[your-ipfs-hash]`

You can configure a custom domain in the Fleek settings if desired. 