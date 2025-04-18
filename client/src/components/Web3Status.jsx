import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { connectWallet, isMetaMaskInstalled, getNetwork, handleAccountsChanged, handleChainChanged } from '../utils/web3';

const Web3Status = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [networkName, setNetworkName] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMetaMask, setIsMetaMask] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkMetaMask = async () => {
      try {
        const hasMetaMask = isMetaMaskInstalled();
        setIsMetaMask(hasMetaMask);
        
        if (hasMetaMask) {
          // Check if already connected
          if (localStorage.getItem('walletConnected')) {
            handleConnectWallet();
          }
          
          // Setup event listeners
          handleChainChanged((chainId) => {
            window.location.reload();
          });
          
          handleAccountsChanged((account) => {
            if (account) {
              setWalletAddress(account);
            } else {
              setWalletAddress('');
              localStorage.removeItem('walletConnected');
            }
          });
        }
      } catch (err) {
        console.error("Error initializing Web3:", err);
        setError("Failed to initialize Web3 connection");
      }
    };
    
    checkMetaMask();
    
    // Clean up event listeners
    return () => {
      try {
        if (isMetaMaskInstalled()) {
          window.ethereum.removeAllListeners('chainChanged');
          window.ethereum.removeAllListeners('accountsChanged');
        }
      } catch (err) {
        console.error("Error cleaning up Web3 listeners:", err);
      }
    };
  }, []);

  const handleConnectWallet = async () => {
    if (!isMetaMask) {
      toast.error('Please install MetaMask to connect your wallet');
      return;
    }
    
    setIsConnecting(true);
    setError('');
    
    try {
      const { provider, address } = await connectWallet();
      setWalletAddress(address);
      
      const network = await getNetwork(provider);
      setNetworkName(network);
      
      localStorage.setItem('walletConnected', 'true');
      toast.success('Wallet connected successfully');
    } catch (error) {
      console.error('Wallet connection error:', error);
      setError(error.message || 'Failed to connect wallet');
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  if (error) {
    return (
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-4 rounded-lg mb-6">
        <div className="flex flex-wrap items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-1">Blockchain Connection</h3>
            <p className="text-sm text-red-400">{error}</p>
          </div>
          
          <motion.button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white mt-2 sm:mt-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setError('')}
          >
            Retry
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-4 rounded-lg mb-6">
      <div className="flex flex-wrap items-center justify-between">
        <div>
          <h3 className="text-lg font-medium mb-1">Blockchain Connection</h3>
          <p className="text-sm text-gray-300">
            {isMetaMask 
              ? 'MetaMask is installed' 
              : 'MetaMask not detected. Please install MetaMask to use Web3 features.'}
          </p>
        </div>
        
        <motion.button
          className={`px-4 py-2 rounded-lg ${walletAddress ? 'bg-green-600' : 'bg-blue-600'} text-white mt-2 sm:mt-0`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isConnecting || !isMetaMask}
          onClick={handleConnectWallet}
        >
          {isConnecting ? 'Connecting...' : walletAddress ? 'Connected' : 'Connect Wallet'}
        </motion.button>
      </div>
      
      {walletAddress && (
        <div className="mt-4 p-4 bg-gray-700 bg-opacity-50 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Connected Address</p>
              <p className="text-sm font-mono break-all">{walletAddress}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Network</p>
              <p className="text-sm">{networkName || 'Loading...'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Web3Status; 