import React from 'react';
import { motion } from 'framer-motion';

export function StreamingText() {
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 to-indigo-900 shadow-2xl">
      <div className="px-8 pb-8 pt-6 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-2xl font-bold text-white"
        >
          Your data is in safe hands
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 text-base text-blue-100 leading-relaxed"
        >
          Share and manage medical insurance records endlessly without worrying about tampering or misuse. 
          With the combined power of JSON Web Encryption (JWE) and blockchain, your information stays secure, 
          private, and completely under your control.
        </motion.p>
        
        <motion.div 
          className="flex gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
          >
            Learn More
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 rounded-full bg-white text-blue-900 hover:bg-blue-50 transition-all duration-200"
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
} 