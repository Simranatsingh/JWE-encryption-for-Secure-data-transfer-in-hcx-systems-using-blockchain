/**
 * Utility for system diagnostics and health checks
 */
const mongoose = require('mongoose');
const os = require('os');

/**
 * Get system health statistics
 * @returns {Object} System health information
 */
async function getSystemHealth() {
  try {
    console.log('Running system health check...');
    
    // Check database connection
    const dbStatus = mongoose.connection.readyState;
    const dbStatusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    // Get database stats if connected
    let dbStats = null;
    if (dbStatus === 1) {
      const db = mongoose.connection.db;
      dbStats = await db.stats();
    }
    
    // Get system information
    const systemInfo = {
      platform: process.platform,
      nodeVersion: process.version,
      uptime: process.uptime(),
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        processUsage: process.memoryUsage()
      },
      cpus: os.cpus().length,
      loadAverage: os.loadavg()
    };
    
    // Construct the health report
    const healthReport = {
      timestamp: new Date(),
      database: {
        status: dbStatusMap[dbStatus] || 'unknown',
        stats: dbStats
      },
      system: systemInfo,
      api: {
        status: 'operational'
      }
    };
    
    console.log('System health check completed');
    return healthReport;
  } catch (error) {
    console.error('Error in system health check:', error);
    return {
      timestamp: new Date(),
      status: 'error',
      error: error.message
    };
  }
}

/**
 * Logs database collections and document counts
 * @returns {Promise<Object>} Collection statistics
 */
async function logDatabaseStats() {
  try {
    console.log('Gathering database statistics...');
    
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected, cannot log stats');
      return { status: 'not_connected' };
    }
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const stats = {};
    
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      stats[collection.name] = { count };
    }
    
    console.log('Database statistics:', stats);
    return stats;
  } catch (error) {
    console.error('Error logging database stats:', error);
    return { status: 'error', message: error.message };
  }
}

module.exports = {
  getSystemHealth,
  logDatabaseStats
}; 