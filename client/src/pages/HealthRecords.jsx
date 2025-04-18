import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HealthRecords = () => {
  return (
    <motion.div 
      className="min-h-screen p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="flex items-center mb-8"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Link to="/dashboard">
            <button className="mr-4 text-blue-400 hover:text-blue-300">
              ← Back to Dashboard
            </button>
          </Link>
          <h1 className="text-3xl font-bold">Health Records</h1>
        </motion.div>
        
        <motion.div 
          className="bg-gray-800 bg-opacity-50 p-6 rounded-lg mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-gray-300">
            Your health records are secure and encrypted on the blockchain. 
            Only you and your authorized healthcare providers can access them.
          </p>
        </motion.div>
        
        <motion.div
          className="grid gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              className="bg-gray-800 bg-opacity-50 p-6 rounded-lg"
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Record #{i}</h3>
                  <p className="text-gray-400">Added on {new Date().toLocaleDateString()}</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  View
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HealthRecords; 