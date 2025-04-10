const mongoose = require('mongoose');

/**
 * Fixes the database indexes by removing problematic ones
 */
async function fixDatabaseIndexes() {
  try {
    console.log('Checking and fixing database indexes...');
    
    // Get a reference to the users collection
    const db = mongoose.connection.db;
    if (!db) {
      console.log('Database connection not established yet');
      return;
    }
    
    const usersCollection = db.collection('users');
    
    // Get all indexes from the users collection
    const indexes = await usersCollection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));
    
    // Check if walletAddress index exists and drop it
    const walletAddressIndex = indexes.find(idx => 
      idx.key && idx.key.walletAddress !== undefined
    );
    
    if (walletAddressIndex) {
      console.log('Dropping problematic walletAddress index:', walletAddressIndex.name);
      await usersCollection.dropIndex(walletAddressIndex.name);
      console.log('Successfully dropped walletAddress index');
    } else {
      console.log('No problematic walletAddress index found');
    }
    
    console.log('Database indexes fixed successfully');
  } catch (error) {
    console.error('Error fixing database indexes:', error);
  }
}

module.exports = {
  fixDatabaseIndexes
}; 