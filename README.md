# Medical Records DApp

A blockchain-based secure medical records management application built with React, Ethereum, and IPFS.

## 🚀 Features

- **Secure Authentication**: Login and register functionality
- **Web3 Integration**: Connect your MetaMask wallet
- **Health Records Management**: View and manage your medical records securely
- **Reports Access**: Access and download medical reports
- **Blockchain Storage**: Encrypted and secure on the blockchain
- **IPFS Integration**: Decentralized storage for medical files

## 📋 Prerequisites

- Node.js (v16+)
- npm or yarn
- MetaMask browser extension

## 🛠️ Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/medical-records-dapp.git
   cd medical-records-dapp
   ```

2. **Install dependencies**
   ```bash
   # Client setup
   cd client
   npm install

   # Server setup (optional)
   cd ../server
   npm install
   ```

3. **Set up environment variables**
   - Create `.env` file in the client directory:
   ```
   VITE_WEB3_MODE=false
   CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
   VITE_API_URL=http://localhost:5005/api
   ```

4. **Start development server**
   ```bash
   # In client directory
   npm run dev
   
   # In server directory (optional)
   npm run dev
   ```

5. **Access the application**
   - Open browser at `http://localhost:5173`

## 🌐 Web3 Deployment Guide

### Method 1: Using GitHub Actions (Automatic Deployment)

1. **Fork this repository to your GitHub account**

2. **Set up GitHub Secrets**
   - Go to your repository's Settings > Secrets > Actions
   - Add the following secrets:
     - `INFURA_PROJECT_ID` - Your Infura project ID
     - `INFURA_API_KEY_SECRET` - Your Infura API key secret

3. **Enable GitHub Actions**
   - Go to the "Actions" tab in your repository
   - Click "I understand my workflows, go ahead and enable them"

4. **Push changes to trigger deployment**
   - Any push to the `main` or `master` branch will trigger deployment
   - Check the "Actions" tab to see deployment progress
   - The IPFS hash will be shown in the logs after successful deployment

### Method 2: Manual Deployment

1. **Install IPFS Deploy**
   ```bash
   npm install -g ipfs-deploy
   ```

2. **Build for Web3**
   ```bash
   cd client
   npm run build:web3
   ```

3. **Deploy to IPFS**
   ```bash
   cd client
   npm run deploy:ipfs
   ```

4. **Access your DApp**
   - Use the IPFS hash provided after deployment
   - Access via: `https://ipfs.io/ipfs/YOUR_HASH`

## 🔒 Smart Contract Deployment (Optional)

If you want to deploy your own smart contract:

1. **Install Remix IDE**
   - Go to https://remix.ethereum.org/

2. **Create or import the contract**
   - Create `MedicalRecords.sol` with the contract code

3. **Compile the contract**
   - Select Solidity compiler and compile

4. **Deploy to testnet**
   - Select "Injected Provider - MetaMask"
   - Make sure MetaMask is connected to the desired testnet
   - Deploy the contract

5. **Update the contract address**
   - Copy the deployed contract address
   - Update the `CONTRACT_ADDRESS` in your environment variables

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- React and Vite for the frontend framework
- Ethereum and Web3.js for blockchain integration
- IPFS for decentralized storage
- Framer Motion for animations
- Tailwind CSS for styling

## Deployment to Fleek

This application has been configured for deployment to Fleek, which allows hosting on IPFS. Since Fleek doesn't support backend services, we've modified the application to connect directly to Supabase from the frontend.

To deploy to Fleek:

1. Log in to [Fleek](https://app.fleek.co/) and create a new site
2. Connect to your GitHub repository: `Simranatsingh/JWE-encryption-for-Secure-data-transfer-in-hcx-systems-using-blockchain`
3. Configure the build settings as follows:
   - **Framework**: Other
   - **Docker Image**: node:16
   - **Build Command**: `bash ./build-for-fleek.sh`
   - **Publish Directory**: `client/dist`
   - **Base Directory**: `/` (default)
   - **Environment Variables**:
     - `VITE_FLEEK_DEPLOYMENT`: `true`
     - `VITE_SUPABASE_URL`: `https://ekhuscbqsqrljhkzukak.supabase.co`
     - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVraHVzY2Jxc3FybGpoa3p1a2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzOTU2MjAsImV4cCI6MjA2MDk3MTYyMH0.LS9TlpTsYNW859wHMwjdGkitDOcC5-YkkR93VKXCwDE`

4. Click "Deploy Site"

The Fleek deployment uses:
- Direct connection to Supabase from the frontend
- Supabase Auth for authentication
- Supabase Database for data storage

For more detailed instructions, see `client/FLEEK_DEPLOYMENT.md`. 