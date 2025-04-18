import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CpuArchitecture } from '../components/ui/cpu-architecture';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.3,
      duration: 0.5
    }
  },
  exit: {
    opacity: 0,
    transition: { 
      when: "afterChildren",
      staggerChildren: 0.1,
      staggerDirection: -1,
      duration: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 10
    }
  },
  exit: { 
    y: 30, 
    opacity: 0,
    transition: { 
      type: "tween", 
      ease: "easeIn"
    }
  }
};

const buttonVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 200,
      damping: 10
    }
  },
  hover: { 
    scale: 1.05,
    transition: { 
      type: "spring", 
      stiffness: 400,
      damping: 10
    }
  },
  tap: { scale: 0.95 }
};

const LandingPage = () => {
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20"
          variants={containerVariants}
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6 gradient-text"
            variants={itemVariants}
          >
            Medical Records DApp
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Secure medical record management on the blockchain with end-to-end encryption
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-6"
            variants={itemVariants}
          >
            <Link to="/register">
              <motion.button
                className="px-8 py-4 bg-blue-600 text-white rounded-lg flex items-center gap-2 font-semibold"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <CpuArchitecture width="24" height="24" text="REG" />
                Get Started
              </motion.button>
            </Link>
            
            <Link to="/login">
              <motion.button
                className="px-8 py-4 bg-gray-800 text-white rounded-lg flex items-center gap-2 font-semibold"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <CpuArchitecture width="24" height="24" text="LOG" />
                Login
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Feature section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          variants={containerVariants}
        >
          {[
            { 
              icon: "🔒", 
              title: "Blockchain Security", 
              desc: "Your data is securely stored on the blockchain, making it tamper-proof" 
            },
            { 
              icon: "🔐", 
              title: "End-to-End Encryption", 
              desc: "All communications are encrypted using advanced cryptography" 
            },
            { 
              icon: "👤", 
              title: "Complete Control", 
              desc: "You have full control over who can access your medical records" 
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPage; 