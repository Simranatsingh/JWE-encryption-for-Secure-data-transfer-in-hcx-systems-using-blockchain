import { ethers } from 'ethers';
import ReportStorage from '../../blockchain/ReportStorage.json';

const blockchainService = {
  async connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return { provider, signer };
      } catch (error) {
        console.error('Error connecting to wallet:', error);
        throw error;
      }
    } else {
      console.log('MetaMask not installed - using read-only mode');
      // Use a fallback provider for read-only operations
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.VITE_ETHEREUM_RPC_URL || 'https://sepolia.infura.io/v3/your-project-id'
      );
      return { provider, signer: null };
    }
  },

  async storeReportHash(reportHash, reportType, recipientAddress, ipfsHash) {
    const { signer } = await this.connectWallet();
    if (!signer) {
      throw new Error('Wallet connection required to store reports');
    }

    const contract = new ethers.Contract(
      process.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
      ReportStorage.abi,
      signer
    );

    try {
      const tx = await contract.storeReport(
        reportHash,
        reportType,
        recipientAddress,
        ipfsHash
      );
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error storing report on blockchain:', error);
      throw error;
    }
  },

  async getReport(reportId) {
    const { provider } = await this.connectWallet();
    const contract = new ethers.Contract(
      process.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
      ReportStorage.abi,
      provider
    );

    try {
      return await contract.getReport(reportId);
    } catch (error) {
      console.error('Error fetching report from blockchain:', error);
      throw error;
    }
  }
};

export default blockchainService; 