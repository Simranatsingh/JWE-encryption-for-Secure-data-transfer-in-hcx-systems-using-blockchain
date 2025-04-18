import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Profile = () => {
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
          <h1 className="text-3xl font-bold">Your Profile</h1>
        </motion.div>
        
        <motion.div 
          className="bg-gray-800 bg-opacity-50 p-8 rounded-lg mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold">
              JP
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">John Doe</h2>
              <p className="text-gray-400">john.doe@example.com</p>
              <p className="text-gray-400">Account created: January 15, 2023</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Account Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Full Name</p>
                <p>John Paul Doe</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Email Address</p>
                <p>john.doe@example.com</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Phone Number</p>
                <p>+1 (555) 123-4567</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Date of Birth</p>
                <p>May 12, 1985</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Security</h3>
            <div className="space-y-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Change Password
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Two-Factor Authentication
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Connected Accounts
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile; 