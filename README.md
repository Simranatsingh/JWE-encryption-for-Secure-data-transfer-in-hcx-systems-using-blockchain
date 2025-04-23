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

This application has been configured for deployment to Fleek, which allows hosting on IPFS.

### Quick Deployment

1. Go to [Fleek](https://app.fleek.co/)
2. Connect to your GitHub repository
3. Use the build command: `chmod +x ./pure-static-build.sh && ./pure-static-build.sh`
4. Set the publish directory to: `client/dist`

For detailed instructions, see [FLEEK_DEPLOYMENT_GUIDE.md](FLEEK_DEPLOYMENT_GUIDE.md).

### What's Deployed

The Fleek deployment includes:
- A static version of the application's interface
- Connection to Supabase backend
- Links to the GitHub repository and documentation

The deployed application is accessible via:
- Fleek URL: `https://[your-site-name].on.fleek.co`
- IPFS hash: `ipfs://[your-ipfs-hash]` 