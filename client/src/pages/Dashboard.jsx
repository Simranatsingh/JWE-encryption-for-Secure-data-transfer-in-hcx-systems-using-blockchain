import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Lazy load Web3Status to prevent errors if Web3 is not available
const Web3Status = lazy(() => import('../components/Web3Status'));

const Dashboard = () => {
  return (
    <motion.div 
      className="min-h-screen p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          className="text-3xl font-bold mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard
        </motion.h1>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Suspense fallback={
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg mb-6">
              <p>Loading Web3 connection...</p>
            </div>
          }>
            <Web3Status />
          </Suspense>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div 
            className="bg-gray-800 bg-opacity-50 p-6 rounded-lg"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <h2 className="text-xl font-semibold mb-2">Your Health Records</h2>
            <p className="text-gray-400 mb-4">View and manage your health records</p>
            <Link to="/health-records">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                View Records
              </button>
            </Link>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800 bg-opacity-50 p-6 rounded-lg"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <h2 className="text-xl font-semibold mb-2">Reports</h2>
            <p className="text-gray-400 mb-4">Access and download medical reports</p>
            <Link to="/reports">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                View Reports
              </button>
            </Link>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800 bg-opacity-50 p-6 rounded-lg"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
            <p className="text-gray-400 mb-4">Manage your account settings</p>
            <Link to="/profile">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                View Profile
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard; 