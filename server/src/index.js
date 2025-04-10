const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const reportsRoutes = require('./routes/reports.routes');
const { fixDatabaseIndexes } = require('./utils/db');
const { getSystemHealth, logDatabaseStats } = require('./utils/diagnostics');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportsRoutes);

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Backend server is running!' });
});

// Health check route
app.get('/health', async (req, res) => {
  try {
    const healthData = await getSystemHealth();
    res.json({ 
      status: 'ok',
      version: '1.0.0',
      timestamp: new Date(),
      ...healthData
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Diagnostics route - admin only
app.get('/api/diagnostics', async (req, res) => {
  // In a production application, this should be secured with authentication
  try {
    const dbStats = await logDatabaseStats();
    const healthData = await getSystemHealth();
    
    res.json({
      timestamp: new Date(),
      database: dbStats,
      system: healthData.system,
      apiStatus: 'operational'
    });
  } catch (error) {
    console.error('Diagnostics error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Add basic request duration monitoring directly
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Start server - simplified and fixed
const BASE_PORT = process.env.PORT || 5005;
const PORTS_TO_TRY = [5005, 8000, 8001, 9000]; // Predefined ports to try in order
const MAX_PORT_ATTEMPTS = 4; // Limited to the number of predefined ports

// Function to start the server with simplified port selection
const startServer = (attemptCount = 0) => {
  // Exit if we've tried all ports
  if (attemptCount >= MAX_PORT_ATTEMPTS) {
    console.error(`Failed to find an available port after trying ${MAX_PORT_ATTEMPTS} predefined ports.`);
    console.error('Please manually kill processes using ports or restart your computer.');
    process.exit(1);
    return;
  }
  
  // Get port to try from our predefined list
  const portToTry = PORTS_TO_TRY[attemptCount];
  
  const server = app.listen(portToTry, () => {
    console.log(`Server is running on port ${portToTry}`);
    console.log(`CORS enabled for origin: ${process.env.CORS_ORIGIN}`);
    
    // Log database stats on startup
    try {
      logDatabaseStats().catch(err => console.error('Failed to log database stats:', err));
    } catch (error) {
      console.error('Error logging database stats:', error);
      // Don't crash the server if database logging fails
    }
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${portToTry} is already in use, trying next port...`);
      startServer(attemptCount + 1);
    } else {
      console.error('Error starting server:', err);
    }
  });
};

// Connect to MongoDB first, then start the server
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Fix any problematic database indexes before starting the server
    await fixDatabaseIndexes();
    
    startServer(0); // Start with the first port in the list
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Error [${req.method} ${req.url}]:`, err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? 'An internal server error occurred' : err.message
  });
}); 