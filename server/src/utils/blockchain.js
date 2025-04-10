const Web3 = require('web3');
const { generateHash } = require('./encryption');

class BlockchainService {
  constructor() {
    this.web3 = new Web3(process.env.WEB3_PROVIDER);
    this.contract = null;
    this.initialize();
  }

  async initialize() {
    try {
      // Load contract ABI and address from environment variables
      const contractABI = JSON.parse(process.env.CONTRACT_ABI);
      const contractAddress = process.env.CONTRACT_ADDRESS;

      this.contract = new this.web3.eth.Contract(contractABI, contractAddress);
      console.log('Blockchain service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  async storeHealthRecordHash(recordId, hash, metadata) {
    try {
      const accounts = await this.web3.eth.getAccounts();
      
      const result = await this.contract.methods
        .storeHealthRecord(recordId, hash, JSON.stringify(metadata))
        .send({ from: accounts[0] });

      return result.transactionHash;
    } catch (error) {
      console.error('Failed to store health record hash:', error);
      throw error;
    }
  }

  async verifyHealthRecord(recordId) {
    try {
      const record = await this.contract.methods
        .getHealthRecord(recordId)
        .call();

      return record;
    } catch (error) {
      console.error('Failed to verify health record:', error);
      throw error;
    }
  }

  async grantAccess(recordId, userAddress, expiryTime) {
    try {
      const accounts = await this.web3.eth.getAccounts();
      
      const result = await this.contract.methods
        .grantAccess(recordId, userAddress, expiryTime)
        .send({ from: accounts[0] });

      return result.transactionHash;
    } catch (error) {
      console.error('Failed to grant access:', error);
      throw error;
    }
  }

  async revokeAccess(recordId, userAddress) {
    try {
      const accounts = await this.web3.eth.getAccounts();
      
      const result = await this.contract.methods
        .revokeAccess(recordId, userAddress)
        .send({ from: accounts[0] });

      return result.transactionHash;
    } catch (error) {
      console.error('Failed to revoke access:', error);
      throw error;
    }
  }

  async checkAccess(recordId, userAddress) {
    try {
      const hasAccess = await this.contract.methods
        .hasAccess(recordId, userAddress)
        .call();

      return hasAccess;
    } catch (error) {
      console.error('Failed to check access:', error);
      throw error;
    }
  }
}

module.exports = new BlockchainService(); 