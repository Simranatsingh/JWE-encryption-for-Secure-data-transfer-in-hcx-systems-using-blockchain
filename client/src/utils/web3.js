import { ethers } from 'ethers';
import Web3 from 'web3';

// ABI from the contract compilation
const contractABI = [
  // This is a placeholder, replace with your actual contract ABI
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_unlockTime",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "when",
        "type": "uint256"
      }
    ],
    "name": "Withdrawal",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unlockTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Contract address from environment variables
const contractAddress = import.meta.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

/**
 * Connect to MetaMask and get the provider and signer
 * @returns {Object} Provider and signer objects
 */
export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed. Please install MetaMask.");
    }
    
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    
    return { provider, signer, address };
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    throw error;
  }
};

/**
 * Get the contract instance
 * @param {Object} signer - The signer from ethers.js
 * @returns {Object} Contract instance
 */
export const getContract = (signer) => {
  return new ethers.Contract(contractAddress, contractABI, signer);
};

/**
 * Check if MetaMask is installed
 * @returns {Boolean} Whether MetaMask is installed
 */
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && window.ethereum !== undefined;
};

/**
 * Get the current network
 * @param {Object} provider - The provider from ethers.js
 * @returns {String} Network name
 */
export const getNetwork = async (provider) => {
  const network = await provider.getNetwork();
  switch (network.chainId) {
    case 1:
      return 'Ethereum Mainnet';
    case 11155111:
      return 'Sepolia Testnet';
    case 5:
      return 'Goerli Testnet';
    case 137:
      return 'Polygon Mainnet';
    case 80001:
      return 'Mumbai Testnet';
    default:
      return `Chain ID: ${network.chainId}`;
  }
};

/**
 * Handle the chain change event
 * @param {Function} callback - Function to call when chain changes
 */
export const handleChainChanged = (callback) => {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', (chainId) => {
      callback(parseInt(chainId, 16));
    });
  }
};

/**
 * Handle the account change event
 * @param {Function} callback - Function to call when account changes
 */
export const handleAccountsChanged = (callback) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
      callback(accounts[0]);
    });
  }
};

/**
 * Disconnect event listeners
 */
export const disconnectEvents = () => {
  if (window.ethereum) {
    window.ethereum.removeAllListeners('chainChanged');
    window.ethereum.removeAllListeners('accountsChanged');
  }
};

export default {
  connectWallet,
  getContract,
  isMetaMaskInstalled,
  getNetwork,
  handleChainChanged,
  handleAccountsChanged,
  disconnectEvents
}; 